// Make sure you import your Candidate model at the top of the file
const Candidate = require('./models/Candidate'); // Adjust the path as needed

// ✅ ADD THIS ENTIRE ROUTE HANDLER
app.post('/create-candidate', async (req, res) => {
  try {
    // 1. Get the name, email, and phone from the request body
    const { name, email, phone } = req.body;

    // Basic validation to ensure required fields are present
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required.' });
    }

    // 2. Create a new candidate instance using your model
    const newCandidate = new Candidate({
      name,
      email,
      phone,
    });

    // 3. Save the new candidate to the database
    // The 'pre-save' hook in your schema will automatically generate the candidateId
    await newCandidate.save();

    // 4. Send a success response back to the frontend with the new candidate's ID
    res.status(201).json({
      data: {
        message: 'Candidate created successfully!',
        candidateId: newCandidate.candidateId,
        // Also send back the other details in case the frontend needs them
        name: newCandidate.name,
        email: newCandidate.email,
        phone: newCandidate.phone,
        quizCompleted: newCandidate.quizCompleted
      },
    });

  } catch (error) {
    console.error('Error creating candidate:', error);

    // This is a special check for duplicate emails (very common!)
    // MongoDB throws an error with code 11000 for unique constraint violations
    if (error.code === 11000) {
      return res.status(409).json({ error: 'A candidate with this email already exists.' });
    }

    // For all other errors, send a generic server error response
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});