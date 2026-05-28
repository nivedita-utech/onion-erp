import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineMenu, HiOutlineBell, HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';
import { logout } from '../../store/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 backdrop-blur-lg border-b transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <HiOutlineMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold shadow-glow">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.name?.replace('_', ' ') || 'Role'}</p>
              </div>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 border rounded-xl shadow-2xl py-2 animate-slide-up transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/settings'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-primary-500 hover:bg-white/5 transition-colors"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

