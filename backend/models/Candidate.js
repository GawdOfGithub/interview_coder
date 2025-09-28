const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    candidateId: {
        type: String,
        unique: true,
    },
});

// Pre-save hook to generate candidateId from name, email, and phone
CandidateSchema.pre('save', function(next) {
    if (this.isNew) {
        // Concatenate relevant fields and hash them to create a unique ID
        const uniqueString = `${this.name}-${this.email}-${this.phone}`;
        this.candidateId = require('crypto').createHash('md5').update(uniqueString).digest('hex');
    }
    next();
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
