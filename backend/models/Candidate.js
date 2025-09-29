const mongoose = require('mongoose');
const crypto = require('crypto');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    candidateId: { type: String, unique: true },
    resumeText: { type: String },
    aiSummary: { type: String },
    chatHistory: [
        {
            sender: String,
            text: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
    score: {
        type: Number,
    },
    // ✅ 1. ADD THE NEW FIELD
    quizCompleted: {
        type: Boolean,
        default: false,
    },
});

// Pre-save hook to generate candidateId
CandidateSchema.pre('save', function(next) {
    if (this.isNew) {
        const uniqueString = `${this.name}-${this.email}-${this.phone}`;
        this.candidateId = crypto.createHash('md5').update(uniqueString).digest('hex');
    }
    next();
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;