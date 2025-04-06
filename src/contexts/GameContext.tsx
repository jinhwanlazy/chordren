// GameContext.sx
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { Chord, allChords, validateNotes, chordToString } from '../utils/chordUtils';
import { NoteSet } from '../utils/noteUtils';
import { useMidiContext } from './MidiContext';
import { useUserStatsContext } from './UserStatsContext'; // Add this import

interface GameContextType {
  targetChord: Chord | null;
  targetChordName: string | null;
  isCorrect: boolean;
  isFailed: boolean;
  isTimedOut: boolean;
  moveToNextChord: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetChord, setTargetChord] = useState<Chord | null>(null);
  const [targetChordName, setTargetChordName] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { activeNotes } = useMidiContext();
  const { recordAttempt } = useUserStatsContext();
  const initializedRef = useRef(false);

  const moveToNextChord = useCallback(() => {
    console.log("moveToNextChord");
    const randomIndex = Math.floor(Math.random() * allChords.length);
    const nextChord = allChords[randomIndex];

    setTargetChord(nextChord);
    setIsCorrect(false);
    setIsFailed(false);
    setIsTimedOut(false);
    setStartTime(Date.now());
  }, []);

  // Initialize with first chord
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      moveToNextChord();
    }
  }, [moveToNextChord]);

  // Check end of session.
  useEffect(() => {;
    if (!targetChord) {
      return;
    }
    if (isCorrect && activeNotes.length === 0) {
      moveToNextChord();
    }
  }, [isCorrect, activeNotes, targetChord, moveToNextChord, recordAttempt, startTime ])

  // Check if notes match the target chord
  useEffect(() => {
    if (!targetChord) {
      return;
    }
    const notes = activeNotes.map(note => note.number);
    if (validateNotes(targetChord, new NoteSet(notes))) {
      const responseTime = Date.now() - startTime;
      recordAttempt(targetChord, responseTime);
      setIsCorrect(true);
    }
  }, [activeNotes, targetChord]);

  useEffect(() => {
    setTargetChordName(targetChord ? chordToString(targetChord) : 'Loading...');

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (elapsed > 5 && !isTimedOut && !isCorrect) {
        setIsTimedOut(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetChord, startTime, isCorrect, isTimedOut]);

  return (
    <GameContext.Provider
      value={{
        targetChord,
        targetChordName,
        isCorrect,
        isFailed,
        isTimedOut,
        moveToNextChord,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
