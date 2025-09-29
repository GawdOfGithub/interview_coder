require('dotenv').config(); // Load environment variables
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate'); // Import Candidate model
const Score = require('./models/Score'); // Import Score model
const { generateQuizQuestions, generateSummary } = require('./utils/geminiApi'); // Import Gemini utility functions

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors()); // Use cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/parse-resume', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;

        const nameRegexLabel = /(Name|Candidate Name|Full Name):\s*([A-Za-z.\s-]+)/i;
        const nameRegexNoLabel = /^\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,})\s*$/m; // Matches two or more capitalized words at the start of a line
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const phoneRegex = /(\+?\d{1,2}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;

        const nameMatchLabel = resumeText.match(nameRegexLabel);
        let nameMatchNoLabel = null;
        if (!nameMatchLabel) {
            const lines = resumeText.split('\n');
            for (const line of lines) {
                const match = line.match(nameRegexNoLabel);
                if (match) {
                    nameMatchNoLabel = match;
                    break;
                }
            }
        }
        
        const emailMatch = resumeText.match(emailRegex);
        const phoneMatch = resumeText.match(phoneRegex);

        let extractedName = nameMatchLabel ? nameMatchLabel[2].trim() : (nameMatchNoLabel ? nameMatchNoLabel[1].trim() : null);
        let extractedEmail = emailMatch ? emailMatch[0].trim() : null;
        let extractedPhone = phoneMatch ? phoneMatch[0].trim() : null;

        const errors = [];
        if (!extractedName) {
            errors.push('name');
        }
        if (!extractedEmail) {
            errors.push('email');
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/.test(extractedEmail)) {
            errors.push('email (invalid format)');
        }
        if (!extractedPhone) {
            errors.push('phone number');
        } else if (!/^(\+?\d{1,2}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(extractedPhone)) {
            errors.push('phone number (invalid format)');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: `Failed to extract the following properties: ${errors.join(', ')}. Please manually enter them.`,
                extractedData: {
                    name: extractedName,
                    email: extractedEmail,
                    phone: extractedPhone
                }
            });
        }

        // Save candidate to MongoDB
        let candidate;
        try {
            candidate = new Candidate({ name: extractedName, email: extractedEmail, phone: extractedPhone, resumeText });
            await candidate.save();
            console.log('Candidate saved to MongoDB', candidate);
        } catch (dbError) {
            if (dbError.code === 11000) { // Duplicate key error (e.g., email already exists)
                // Attempt to find existing candidate by email
                candidate = await Candidate.findOne({ email: extractedEmail });
                if (candidate) {
                    console.log('Candidate with this email already exists, returning existing ID', candidate.candidateId);
                    // Update existing candidate with new resume text if it's different
                    if (candidate.resumeText !== resumeText) {
                        candidate.resumeText = resumeText;
                        await candidate.save();
                        console.log('Updated resume text for existing candidate', candidate.candidateId);
                    }
                } else {
                    console.error('Duplicate key error but existing candidate not found:', dbError);
                    return res.status(500).json({ error: 'Error saving candidate data: Duplicate entry.' });
                }
            } else {
                console.error('Error saving candidate to MongoDB:', dbError);
                return res.status(500).json({ error: 'Error saving candidate data.' });
            }
        }

        res.status(200).json({
            message: 'Resume parsed successfully',
            data: {
                name: extractedName,
                email: extractedEmail,
                phone: extractedPhone,
                candidateId: candidate ? candidate.candidateId : null, // Return candidateId
quizCompleted: candidate ? candidate.quizCompleted : false, 
            },
        });
        console.log('Successfully extracted all details:', { name: extractedName, email: extractedEmail, phone: extractedPhone, candidateId: candidate ? candidate.candidateId : null });

    } catch (error) {
        console.error('Error parsing PDF:', error);
        res.status(500).json({ error: 'Error processing resume.' });
    }
});

// Endpoint to get random questions (now using Gemini API)
app.get('/questions', async (req, res) => {
    try {
        console.log("reqesut")
        const numQuestions = parseInt(req.query.limit) || 5;
        const difficulty = req.query.difficulty || 'medium';
        const topic = req.query.topic || 'full-stack development';

        const questions = await generateQuizQuestions(topic, difficulty, numQuestions);
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        res.status(500).json({ error: 'Error generating quiz questions.' });
    }
});

// Endpoint to submit quiz score
app.post('/submit-quiz', async (req, res) => {
    const { candidateId, score, userAnswers } = req.body;

    console.log('Received quiz submission:', { candidateId, score, userAnswers }); // Add userAnswers to logging

    if (!candidateId || score === undefined || !userAnswers || !Array.isArray(userAnswers)) {
        return res.status(400).json({ error: 'Candidate ID, score, and an array of user answers are required.' });
    }

    try {
        // Prepare chat history entries from userAnswers
        const chatHistoryEntries = userAnswers.flatMap(ans => [
            { sender: 'ai', text: ans.question },
            { 
                sender: 'user', 
                text: `Your Answer: ${ans.answer}\nCorrect: ${ans.isCorrect ? 'Yes' : 'No'}\nCorrect Answer: ${ans.correctAnswer}`,
                isCorrect: ans.isCorrect, // Store correctness for easier display
                originalAnswer: ans.correctAnswer, // Store correct answer for display
                yourAnswer: ans.answer, // Store user's answer for display
                question: ans.question, // Store the question text again for grouping in frontend
            }
        ]);

        // Update the Candidate model with the new score and chat history
        const candidate = await Candidate.findOneAndUpdate(
            { candidateId: candidateId },
            // ✅ CHANGED: Added quizCompleted: true to the $set operator
            { $set: { score: score, quizCompleted: true }, $push: { chatHistory: { $each: chatHistoryEntries } } },
            { new: true, upsert: true } // Return the updated document, create if not exists
        );

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found after update.' });
        }
        
        const newScoreEntry = new Score({ candidateId, score });
        await newScoreEntry.save();

        console.log('Candidate and Score updated/saved to MongoDB:', candidate);
        res.status(200).json({ message: 'Score and candidate chat history saved successfully.', candidate });
    } catch (error) {
        console.error('Error saving score and updating candidate:', error);
        res.status(500).json({ error: 'Error saving score and updating candidate.' });
    }
});

// Endpoint to get all candidates
app.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find({});
        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching all candidates:', error);
        res.status(500).json({ error: 'Error fetching candidates.' });
    }
});

// NEW: Endpoint to get a single candidate by candidateId
app.get('/candidates/:candidateId', async (req, res) => {
    try {
        const { candidateId } = req.params;
        const candidate = await Candidate.findOne({ candidateId });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        console.error('Error fetching candidate by ID:', error);
        res.status(500).json({ error: 'Error fetching candidate data.' });
    }
});

// Endpoint to generate AI summary for candidate performance
app.post('/generate-summary', async (req, res) => {
    const { candidateId, performance, userAnswers } = req.body;
    console.log(performance, userAnswers);

    if (!candidateId || !performance || !userAnswers) {
        return res.status(400).json({ error: 'Candidate ID, performance, and user answers are required.' });
    }

    try {
        // Generate summary using Gemini API
        const summary = await generateSummary({ performance, userAnswers });

        // Save summary to the candidate in MongoDB
        const candidate = await Candidate.findOne({ candidateId: candidateId }); // Find by custom candidateId
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found.' });
        }
        candidate.aiSummary = summary;
        await candidate.save();
        console.log(`AI summary saved for candidate ${candidateId}:`, summary);

        res.status(200).json({ message: 'AI summary generated and saved successfully.', aiSummary: summary });
    } catch (error) {
        console.error('Error generating or saving AI summary:', error);
        res.status(500).json({ error: 'Error processing AI summary.' });
    }
});

// Endpoint to get scores by candidate ID
app.get('/scores/:candidateId', async (req, res) => {
    const { candidateId } = req.params;
    console.log('Backend: Received request for scores for candidate ID:', candidateId); // Debugging
    console.log('Backend: Attempting to find scores with query:', { candidateId }); // New debug log

    try {
        const scores = await Score.find({ candidateId }).sort({ date: -1 });
        console.log('Backend: Scores found for candidate ID', candidateId, ':', scores); // Debugging
        if (scores.length === 0) {
            console.warn('Backend: No scores found for candidate ID:', candidateId);
            return res.status(404).json({ message: 'No scores found for this candidate.' });
        }
        res.status(200).json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Error fetching scores.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});