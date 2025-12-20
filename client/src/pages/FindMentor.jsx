import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FindMentor = () => {
    const [mentors, setMentors] = useState([]);
    const [skill, setSkill] = useState('');
    const [loading, setLoading] = useState(false);

    const searchMentors = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/matching/find?skill=${skill}`);
            setMentors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchMentors();
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        searchMentors();
    };

    return (
        <div className="max-w-6xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-indigo-700">Find Your Perfect Mentor</h1>

            <form onSubmit={onSubmit} className="flex justify-center mb-10">
                <input
                    type="text"
                    placeholder="Search by skill (e.g. React, Python, Math)"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full max-w-md px-4 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.length > 0 ? (
                        mentors.map((mentor) => (
                            <div key={mentor._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mr-4">
                                        {mentor.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{mentor.user.name}</h3>
                                        <p className="text-gray-500 text-sm">{mentor.university}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4 line-clamp-3">{mentor.bio}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {mentor.skills.map((s, index) => (
                                        <span key={index} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <div className="flex items-center text-yellow-500">
                                        <span>★</span>
                                        <span className="ml-1 font-bold">{mentor.rating.toFixed(1)}</span>
                                        <span className="text-gray-400 text-sm ml-1">({mentor.reviewCount})</span>
                                    </div>
                                    <Link
                                        to={`/book/${mentor._id}`}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium"
                                    >
                                        Book Session
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No mentors found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindMentor;
