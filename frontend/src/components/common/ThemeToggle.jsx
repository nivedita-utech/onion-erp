import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-white/5 group relative overflow-hidden"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        <HiSun
          className={`w-5 h-5 absolute transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
          } text-orange-400`}
        />
        <HiMoon
          className={`w-5 h-5 absolute transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'
          } text-indigo-400`}
        />
      </div>
      
      {/* Tooltip */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
