import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Award, User, BookOpen, MessageSquare, LogOut, Search, Trophy, Video } from 'lucide-react';
import MeetingCard from '../components/MeetingCard';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                // Fetch user profile
                const profileRes = await axios.get('http://localhost:5000/api/profile/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(profileRes.data.user);
                setProfile(profileRes.data.profile);

                // Fetch sessions
                const sessionsRes = await axios.get('http://localhost:5000/api/sessions', {
                    headers: { 'x-auth-token': token }
                });
                setSessions(sessionsRes.data);

                // Fetch meetings
                const meetingsRes = await axios.get('http://localhost:5000/api/meetings', {
                    headers: { 'x-auth-token': token }
                });
                setMeetings(meetingsRes.data.meetings || []);

            } catch (err) {
                console.error('Dashboard error:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to load dashboard data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            accepted: 'bg-green-100 text-green-800',
            scheduled: 'bg-blue-100 text-blue-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10">
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                    {error}
                </div>
            </div>
        );
    }

    const upcomingSessions = sessions.filter(s =>
        ['pending', 'accepted', 'scheduled'].includes(s.status) &&
        new Date(s.scheduledAt) > new Date()
    );

    const completedSessions = sessions.filter(s => s.status === 'completed');

    const upcomingMeetings = meetings.filter(m =>
        m.status === 'scheduled' &&
        new Date(m.scheduledAt) > new Date()
    );

    const completedMeetings = meetings.filter(m => m.status === 'completed');

    return (
        <div className="max-w-7xl mx-auto mt-8 px-4">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-slate-600">Here's what's happening with your learning journey</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-2xl shadow-lg shadow-primary-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary-100 text-sm font-medium">Upcoming Sessions</p>
                            <p className="text-3xl font-bold mt-1">{upcomingSessions.length}</p>
                        </div>
                        <Calendar className="w-10 h-10 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white p-6 rounded-2xl shadow-lg shadow-secondary-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-secondary-100 text-sm font-medium">Completed Sessions</p>
                            <p className="text-3xl font-bold mt-1">{completedSessions.length}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white p-6 rounded-2xl shadow-lg shadow-accent-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-accent-100 text-sm font-medium">Your Role</p>
                            <p className="text-2xl font-bold mt-1 capitalize">{user?.role}</p>
                        </div>
                        {user?.role === 'mentor' ? <Award className="w-10 h-10 opacity-80" /> : <BookOpen className="w-10 h-10 opacity-80" />}
                    </div>
                </div>
            </div>

            {/* Upcoming Meetings Section */}
            {upcomingMeetings.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Video className="w-6 h-6 text-primary-600" />
                            Upcoming Meetings
                        </h2>
                        <span className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-bold">
                            {upcomingMeetings.length} Scheduled
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingMeetings.slice(0, 3).map((meeting) => (
                            <MeetingCard
                                key={meeting._id}
                                meeting={meeting}
                                userRole={user?.role}
                            />
                        ))}
                    </div>
                    {upcomingMeetings.length > 3 && (
                        <div className="text-center mt-6">
                            <Link
                                to="/meetings"
                                className="text-primary-600 hover:text-primary-700 font-bold text-sm"
                            >
                                View all {upcomingMeetings.length} meetings →
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Profile & Quick Actions) */}
                <div className="space-y-8">
                    {/* Profile Section */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-600" />
                            Your Profile
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Email</p>
                                <p className="font-medium text-slate-900">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Account Type</p>
                                <p className="font-medium text-slate-900 capitalize">{user?.role}</p>
                            </div>
                        </div>

                        {user?.role === 'mentor' && (
                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-accent-500" />
                                    Mentor Details
                                </h3>
                                {profile ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Bio</p>
                                            <p className="text-slate-700 text-sm leading-relaxed mt-1">{profile.bio}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map((skill, index) => (
                                                    <span key={index} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">University</p>
                                                <p className="font-medium text-slate-900">{profile.university}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Points</p>
                                                <p className="font-bold text-accent-600">{profile.points} XP</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                        <p className="text-yellow-800 text-sm mb-3">You haven't set up your mentor profile yet.</p>
                                        <Link to="/create-profile" className="text-primary-600 font-bold text-sm hover:underline">
                                            Create Profile →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="card bg-gradient-to-br from-slate-50 to-white">
                        <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/find-mentor" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all text-center group">
                                <Search className="w-6 h-6 mx-auto mb-2 text-primary-500 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-slate-700">Find Mentors</p>
                            </Link>
                            <Link to="/leaderboard" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-accent-200 transition-all text-center group">
                                <Trophy className="w-6 h-6 mx-auto mb-2 text-accent-500 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-slate-700">Leaderboard</p>
                            </Link>
                            <Link to="/chat" className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-green-200 transition-all text-center group">
                                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-slate-700">Chat</p>
                            </Link>
                            <button onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-red-200 transition-all text-center group">
                                <LogOut className="w-6 h-6 mx-auto mb-2 text-red-500 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-bold text-slate-700">Logout</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sessions & Activity) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Upcoming Sessions */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary-600" />
                                Upcoming Sessions
                            </h2>
                            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
                                {upcomingSessions.length} Total
                            </span>
                        </div>

                        {upcomingSessions.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingSessions.slice(0, 3).map((session) => (
                                    <div key={session._id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50/50">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-slate-800 text-lg">{session.topic}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(session.status)}`}>
                                                {session.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 mb-4 text-sm">{session.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Clock className="w-4 h-4" />
                                            {formatDate(session.scheduledAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium mb-4">No upcoming sessions</p>
                                <Link
                                    to="/find-mentor"
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    Find a Mentor
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-secondary-600" />
                            Recent Activity
                        </h2>

                        {sessions.length > 0 ? (
                            <div className="space-y-4">
                                {sessions.slice(0, 5).map((session) => (
                                    <div key={session._id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${session.status === 'completed' ? 'bg-secondary-500' :
                                            session.status === 'cancelled' ? 'bg-red-500' :
                                                'bg-primary-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{session.topic}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {session.status === 'completed' ? 'Completed' : 'Scheduled'} • {formatDate(session.scheduledAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500">No activity yet</p>
                                <p className="text-sm text-slate-400 mt-2">Book your first session to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
