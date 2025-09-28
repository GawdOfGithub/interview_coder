const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    candidateId: {
        type: String,
        required: true,
        ref: 'Candidate',
        index: true, // Add an index for better query performance and reliability
    },
    score: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Score = mongoose.model('Score', ScoreSchema);

module.exports = Score;
