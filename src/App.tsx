import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import MidiInputSelector from './components/MidiInputSelector/MidiInputSelector';
import PianoKeyboard from './components/PianoKeyboard/PianoKeyboard';
import ChordDisplay from './components/ChordDisplay/ChordDisplay';
import { GameProvider } from './contexts/GameContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { MidiProvider } from './contexts/MidiContext';
import { UserStatsProvider } from './contexts/UserStatsContext';

function AppContent() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className={`mb-12 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
          <MidiInputSelector />
        </div>

        <div className="flex flex-col items-center mb-8">
          <ChordDisplay />
        </div>

        <PianoKeyboard />

      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MidiProvider>
        <UserStatsProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </UserStatsProvider>
      </MidiProvider>
    </ThemeProvider>
  );
}

export default App;

