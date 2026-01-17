const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    maxParticipants: {
        type: Number,
        default: 1
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 60 // minutes
    },
    pricePerLearner: {
        type: Number,
        default: 0
    },
    meetingLink: {
        type: String
    },
    meetingId: {
        type: String // Google Calendar Event ID
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    notes: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
meetingSchema.index({ mentor: 1, scheduledAt: -1 });
meetingSchema.index({ learners: 1, scheduledAt: -1 });
meetingSchema.index({ status: 1, scheduledAt: 1 });

// Virtual for checking if meeting is upcoming
meetingSchema.virtual('isUpcoming').get(function () {
    return this.status === 'scheduled' && this.scheduledAt > new Date();
});

// Virtual for checking if meeting is past
meetingSchema.virtual('isPast').get(function () {
    return this.scheduledAt < new Date();
});

module.exports = mongoose.model('Meeting', meetingSchema);
