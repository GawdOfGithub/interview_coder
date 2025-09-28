// ai-service.js

require('dotenv').config();
// Change 1: Correctly import the main class from the '@google/generative-ai' package.
const { GoogleGenAI  } = require('@google/genai');

// --- Environment Variable Check ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('🔴 GEMINI_API_KEY is not set in the .env file!');
    process.exit(1);
}

// --- Initialize the AI Client ---
// Change 2: Instantiate the client by passing the API key directly.
const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY});


// Change 3: Get the specific generative model you want to use.
// It's better to initialize this once and reuse the 'model' object.
const model = ai.models;
  


/**
 * Generates a specified number of multiple-choice quiz questions on a given topic.
 * @param {string} topic - The subject of the quiz (e.g., "React Hooks").
 * @param {string} difficulty - The desired difficulty (e.g., "easy", "medium", "hard").
 * @param {number} numQuestions - The number of questions to generate.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects.
 */
async function generateQuizQuestions(topic = "full-stack development", difficulty = "medium", numQuestions = 5) {

    const prompt = `
        Generate exactly ${numQuestions} multiple-choice quiz questions about ${topic} with ${difficulty} difficulty.
        Each question must have exactly 4 options and 1 correct answer.
        The output must be a valid JSON array of objects. Do not include any introductory text, concluding text, or markdown formatting like \`\`\`json.
        Each object in the array must have the following structure:
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The correct option text"
        }
    `;

    try {
        // Change 4: Call generateContent directly on the 'model' object, passing the prompt string.
        const result = await model.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt});

        const text = result.candidates[0].content.parts[0].text;

            

        // The prompt now strictly requests JSON, but this is a good safety measure.
        return JSON.parse(text);

    } catch (error) {
        console.error("❌ Error generating quiz questions with Gemini API:", error);
        throw new Error("Failed to generate quiz questions.");
    }
}

/**
 * Generates a concise performance summary based on the candidate's quiz results.
 * @param {Object} candidatePerformance - An object containing performance data (e.g., { score: 80, timeTaken: 120, answers: [...] }).
 * @returns {Promise<string>} A promise that resolves to a text summary.
 */
async function generateSummary(candidatePerformance) {
    const prompt = `
        Analyze the following candidate's quiz performance data: ${JSON.stringify(candidatePerformance)}.
        Based on this data, generate a concise AI summary (maximum 3 sentences) of their potential strengths and weaknesses in technical knowledge.
        The tone should be constructive and professional.
    `;

    try {
        // Change 5: The API call is the same corrected format as above.
        console.log("generating Summary");
        const result = await model.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt});
       const text = result.candidates[0].content.parts[0].text;
        console.log("text summary",text)
        //
        return text;
        
    } catch (error) {
        console.error("❌ Error generating AI summary with Gemini API:", error);
        throw new Error("Failed to generate AI summary.");
    }
}

module.exports = { generateQuizQuestions, generateSummary };