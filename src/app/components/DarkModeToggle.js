"use client";

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <label className="inline-flex items-center cursor-pointer h-12 px-1">
      <input 
        type="checkbox" 
        checked={isDarkMode}
        onChange={toggleTheme}
        className="sr-only peer"
        aria-label="Toggle dark mode"
      />
      <div className="relative w-16 h-8 bg-white/40 dark:bg-slate-700/60 backdrop-blur-sm peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/50 dark:peer-focus:ring-slate-500 rounded-full peer border border-white/30 dark:border-slate-600 transition-all duration-300 ease-in-out">
        {/* Sliding circle with sun/moon */}
        <div 
          className={`absolute top-[4px] start-[4px] flex items-center justify-center bg-white dark:bg-slate-800 rounded-full h-6 w-6 transition-all duration-300 ease-in-out shadow-md ${
            isDarkMode ? 'translate-x-8' : 'translate-x-0'
          }`}
        >
          {/* Sun icon - visible in light mode */}
          <svg 
            className={`w-4 h-4 text-yellow-500 transition-all duration-300 ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </svg>
          
          {/* Moon icon - visible in dark mode */}
          <svg 
            className={`w-4 h-4 text-slate-200 absolute transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
