import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary-400 hover:text-primary-300 transition">
            EventHub
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-400 transition">
              Home
            </Link>
            <Link to="/events" className="hover:text-primary-400 transition">
              Events
            </Link>

            {isAuthenticated && user.role === 'organizer' && (
              <Link to="/create" className="hover:text-primary-400 transition">
                Create Event
              </Link>
            )}

            {isAuthenticated && user.role === 'admin' && (
              <>
                <Link to="/dashboard" className="hover:text-primary-400 transition">
                  Dashboard
                </Link>
                <Link to="/attendees" className="hover:text-primary-400 transition">
                  Attendees
                </Link>
              </>
            )}

            {isAuthenticated && user.role === 'organizer' && (
              <Link to="/attendees" className="hover:text-primary-400 transition">
                My Attendees
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-300">
                  {user.name} <span className="text-xs text-primary-400">({user.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hover:text-primary-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
