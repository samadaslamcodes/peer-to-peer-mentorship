require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const MentorProfile = require('./models/MentorProfile');

const seedData = async () => {
    try {
        // Database is already connected from server.js
        // Clear existing data (optional - comment out if you want to keep existing users)
        // await User.deleteMany({ role: 'mentor' });
        // await MentorProfile.deleteMany({});
        // console.log('🗑️  Cleared existing mentor data');

        // Create mentor users
        const mentorUsers = [
            {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            },
            {
                name: 'Michael Chen',
                email: 'michael.chen@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            },
            {
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            },
            {
                name: 'David Kim',
                email: 'david.kim@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            },
            {
                name: 'Jessica Williams',
                email: 'jessica.williams@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            },
            {
                name: 'Alex Thompson',
                email: 'alex.thompson@university.edu',
                password: await bcrypt.hash('password123', 10),
                role: 'mentor',
                isVerified: true
            }
        ];

        // Check if mentors already exist
        for (const mentorData of mentorUsers) {
            const existingUser = await User.findOne({ email: mentorData.email });
            if (existingUser) {
                console.log(`⏭️  Skipping ${mentorData.name} - already exists`);
                continue;
            }

            const user = new User(mentorData);
            await user.save();
            console.log(`✅ Created user: ${user.name}`);

            // Create mentor profile
            const profileData = getMentorProfileData(user._id, user.name);
            const profile = new MentorProfile(profileData);
            await profile.save();
            console.log(`✅ Created profile for: ${user.name}`);
        }

        console.log('\n🎉 Seed data created successfully!');
        console.log('\n📝 Sample Credentials:');
        console.log('Email: sarah.johnson@university.edu');
        console.log('Password: password123');
        console.log('\n(All mentors use password: password123)');

        // process.exit(0); // Removed for programmatic usage
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        // process.exit(1); // Removed for programmatic usage
    }
};

// Helper function to generate mentor profile data
function getMentorProfileData(userId, name) {
    const profiles = {
        'Sarah Johnson': {
            user: userId,
            skills: ['React', 'JavaScript', 'Node.js', 'Web Development'],
            bio: 'Full-stack developer with 3 years of experience. Passionate about teaching modern web technologies and helping students build real-world projects.',
            university: 'MIT',
            degree: 'Computer Science',
            isApproved: true,
            rating: 4.8,
            reviewCount: 24,
            points: 850,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2024-01-15') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-06-20') }
            ],
            availability: [
                { day: 'Monday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
                { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM'] },
                { day: 'Friday', slots: ['11:00 AM', '3:00 PM'] }
            ]
        },
        'Michael Chen': {
            user: userId,
            skills: ['Python', 'Machine Learning', 'Data Science', 'AI'],
            bio: 'Data scientist specializing in ML and AI. Love helping students understand complex algorithms and apply them to real problems.',
            university: 'Stanford University',
            degree: 'Data Science',
            isApproved: true,
            rating: 4.9,
            reviewCount: 31,
            points: 1250,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2023-11-10') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-03-15') },
                { name: 'Master Mentor', icon: '🥇', earnedAt: new Date('2024-09-01') }
            ],
            availability: [
                { day: 'Tuesday', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] },
                { day: 'Thursday', slots: ['10:00 AM', '3:00 PM'] }
            ]
        },
        'Emily Rodriguez': {
            user: userId,
            skills: ['Java', 'Spring Boot', 'Backend Development', 'Microservices'],
            bio: 'Backend engineer with expertise in Java ecosystem. Helping students master backend development and system design.',
            university: 'UC Berkeley',
            degree: 'Software Engineering',
            isApproved: true,
            rating: 4.7,
            reviewCount: 18,
            points: 620,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2024-02-20') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-08-10') }
            ],
            availability: [
                { day: 'Monday', slots: ['11:00 AM', '3:00 PM'] },
                { day: 'Wednesday', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
                { day: 'Friday', slots: ['10:00 AM'] }
            ]
        },
        'David Kim': {
            user: userId,
            skills: ['Mobile Development', 'React Native', 'iOS', 'Android'],
            bio: 'Mobile app developer passionate about creating amazing user experiences. Teaching both native and cross-platform development.',
            university: 'Carnegie Mellon',
            degree: 'Computer Science',
            isApproved: true,
            rating: 4.6,
            reviewCount: 15,
            points: 480,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2024-03-05') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-09-15') }
            ],
            availability: [
                { day: 'Tuesday', slots: ['2:00 PM', '4:00 PM'] },
                { day: 'Thursday', slots: ['11:00 AM', '1:00 PM', '3:00 PM'] }
            ]
        },
        'Jessica Williams': {
            user: userId,
            skills: ['UI/UX Design', 'Figma', 'CSS', 'Design Systems'],
            bio: 'UI/UX designer helping students create beautiful and functional interfaces. Expert in modern design tools and principles.',
            university: 'Rhode Island School of Design',
            degree: 'Design & Technology',
            isApproved: true,
            rating: 4.9,
            reviewCount: 27,
            points: 920,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2024-01-01') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-05-20') }
            ],
            availability: [
                { day: 'Monday', slots: ['1:00 PM', '3:00 PM'] },
                { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM'] },
                { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] }
            ]
        },
        'Alex Thompson': {
            user: userId,
            skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
            bio: 'DevOps engineer with cloud expertise. Teaching students modern deployment practices and cloud infrastructure.',
            university: 'Georgia Tech',
            degree: 'Computer Engineering',
            isApproved: true,
            rating: 4.8,
            reviewCount: 22,
            points: 750,
            badges: [
                { name: 'Rookie Mentor', icon: '🥉', earnedAt: new Date('2024-02-01') },
                { name: 'Expert Mentor', icon: '🥈', earnedAt: new Date('2024-07-15') }
            ],
            availability: [
                { day: 'Tuesday', slots: ['10:00 AM', '2:00 PM'] },
                { day: 'Thursday', slots: ['9:00 AM', '1:00 PM'] },
                { day: 'Friday', slots: ['11:00 AM', '3:00 PM'] }
            ]
        }
    };

    return profiles[name] || profiles['Sarah Johnson'];
}

module.exports = seedData;
