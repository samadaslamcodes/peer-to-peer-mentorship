import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children }) => (
        <Link
            to={to}
            className={`font-medium transition-colors ${isActive(to) ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}
        >
            {children}
        </Link>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600 font-heading">
                    <GraduationCap className="w-8 h-8" />
                    <span>PeerLearn</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {token ? (
                        <>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/find-mentor">Find Mentors</NavLink>
                            <NavLink to="/leaderboard">Leaderboard</NavLink>
                            <NavLink to="/chat">Chat</NavLink>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Log In</NavLink>
                            <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
                    {token ? (
                        <>
                            <Link to="/dashboard" className="py-2 text-slate-600">Dashboard</Link>
                            <Link to="/find-mentor" className="py-2 text-slate-600">Find Mentors</Link>
                            <Link to="/leaderboard" className="py-2 text-slate-600">Leaderboard</Link>
                            <Link to="/chat" className="py-2 text-slate-600">Chat</Link>
                            <button onClick={handleLogout} className="py-2 text-left text-red-600">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="py-2 text-slate-600">Log In</Link>
                            <Link to="/register" className="btn-primary text-center">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
