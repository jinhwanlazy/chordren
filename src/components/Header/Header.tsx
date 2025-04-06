// src/components/Header/Header.tsx
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header = ({ toggleDarkMode, isDarkMode }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              CHORD 練
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/chordren"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Source Code
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
