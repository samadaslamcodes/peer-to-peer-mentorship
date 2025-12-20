const MentorProfile = require('../models/MentorProfile');

// Award Points
exports.awardPoints = async (req, res) => {
    try {
        const { userId, points, reason } = req.body;

        const profile = await MentorProfile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        profile.points += points;

        // Check for badges
        if (profile.points >= 100 && !profile.badges.some(b => b.name === 'Rookie Mentor')) {
            profile.badges.push({ name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date() });
        }
        if (profile.points >= 500 && !profile.badges.some(b => b.name === 'Expert Mentor')) {
            profile.badges.push({ name: 'Expert Mentor', icon: '🥈', earnedAt: new Date() });
        }
        if (profile.points >= 1000 && !profile.badges.some(b => b.name === 'Master Mentor')) {
            profile.badges.push({ name: 'Master Mentor', icon: '🥇', earnedAt: new Date() });
        }

        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const profiles = await MentorProfile.find()
            .populate('user', ['name', 'avatar'])
            .sort({ points: -1 })
            .limit(10);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
