import { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/gamification/leaderboard');
                setMentors(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Top Mentors Leaderboard</h1>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">Rank</th>
                                <th className="py-3 px-6 text-left">Mentor</th>
                                <th className="py-3 px-6 text-left">Points</th>
                                <th className="py-3 px-6 text-left">Badges</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {mentors.map((mentor, index) => (
                                <tr key={mentor._id} className="border-b hover:bg-gray-50">
                                    <td className="py-4 px-6 font-bold text-lg">
                                        {index + 1 === 1 ? '🥇' : index + 1 === 2 ? '🥈' : index + 1 === 3 ? '🥉' : index + 1}
                                    </td>
                                    <td className="py-4 px-6 flex items-center">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                                            {mentor.user.name.charAt(0)}
                                        </div>
                                        <span className="font-medium">{mentor.user.name}</span>
                                    </td>
                                    <td className="py-4 px-6 font-bold text-indigo-600">{mentor.points}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-1">
                                            {mentor.badges.map((badge, i) => (
                                                <span key={i} title={badge.name} className="text-xl cursor-help">{badge.icon}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
