require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const Score = require('./models/Score'); // Also clear scores related to candidates

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for clearing data...'))
.catch(err => console.error('MongoDB connection error for clearing data:', err));

const clearCandidates = async () => {
    try {
        await Candidate.deleteMany({});
        console.log('All candidate data cleared from MongoDB!');
        await Score.deleteMany({}); // Also clear associated scores
        console.log('All score data cleared from MongoDB!');
    } catch (error) {
        console.error('Error clearing candidate data:', error);
    } finally {
        mongoose.connection.close();
    }
};

clearCandidates();
