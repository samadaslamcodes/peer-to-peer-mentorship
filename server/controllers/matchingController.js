const MentorProfile = require('../models/MentorProfile');

// Find mentors based on skills and availability
exports.findMentors = async (req, res) => {
    try {
        const { skill, day } = req.query;
        let query = { isApproved: true }; // Only show approved mentors

        if (skill) {
            query.skills = { $regex: skill, $options: 'i' }; // Case-insensitive partial match
        }

        if (day) {
            query['availability.day'] = { $regex: day, $options: 'i' };
        }

        const mentors = await MentorProfile.find(query)
            .populate('user', ['name', 'avatar'])
            .sort({ rating: -1 }); // Sort by highest rating

        res.json(mentors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a specific mentor by ID
exports.getMentorById = async (req, res) => {
    try {
        const mentor = await MentorProfile.findById(req.params.id)
            .populate('user', ['name', 'email', 'avatar']);

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json(mentor);
    } catch (err) {
        console.error('Get mentor by ID error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Mentor not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
