import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { allChords, validateNotes } from '../utils/chordUtils';
import { NoteSet } from '../utils/noteUtils';
import { useMidiContext } from './MidiContext';
import { useUserStatsContext } from './UserStatsContext';
import { ChordWithState } from '../types/chord';
import { TIME_LIMIT_MS, ANIMATION_INTERVAL_MS } from '../constants';

interface GameContextType {
  target: ChordWithState | null;
  nextTarget: ChordWithState | null;
  isCorrect: boolean;
  isFailed: boolean;
  isTimedOut: boolean;
  moveToNextTarget: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [target, setTarget] = useState<ChordWithState | null>(null);
  const [nextTarget, setNextTarget] = useState<ChordWithState | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  //const [startTime, setStartTime] = useState<number>(Date.now());
  const { activeNotes } = useMidiContext();
  const { recordAttempt } = useUserStatsContext();
  const initializedRef = useRef(false);

  const getRandomChord = useCallback((): ChordWithState => {
    const randomIndex = Math.floor(Math.random() * allChords.length);
    let chord = {...allChords[randomIndex]};
    chord.accidental = Math.random() < 0.5 ? '#' : 'b';
    return {
      chord,
      startTime: -1
    };
  }, []);

  // Move to the next chord
  const moveToNextTarget = useCallback(() => {
    console.log("moveToNextTarget");

    const newNextTarget = getRandomChord();

    // Current next chord becomes the target chord
    setTarget(nextTarget);
    setNextTarget(newNextTarget);

    setIsCorrect(false);
    setIsFailed(false);
    setIsTimedOut(false);
    //setStartTime(Date.now());
  }, [nextTarget, getRandomChord]);

  // Initialize with first chord and next chord
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;

      // Set initial target chord
      const initialChord = getRandomChord();
      setTarget(initialChord);

      // Set initial next chord
      const initialNextTarget = getRandomChord();
      setNextTarget(initialNextTarget);

      initialChord.startTime = Date.now();
      //setStartTime(Date.now());
    }
  }, [getRandomChord]);

  // Check if we need to visually move to the next chord
  useEffect(() => {
    if (isCorrect && activeNotes.length === 0) {
      moveToNextTarget();
    }
  }, [isCorrect, activeNotes, moveToNextTarget]);

  // Check if notes match the target chord
  useEffect(() => {
    if (!target || isCorrect) {
      return;
    }

    const notes = activeNotes.map(note => note.number);
    if (validateNotes(target.chord, new NoteSet(notes))) {
      recordAttempt(target.chord, target.startTime, Date.now());
      setIsCorrect(true);

      // Start timing for the next chord immediately
      if (nextTarget) {
        nextTarget.startTime = Date.now();
      }
    }
  }, [activeNotes, target, nextTarget, recordAttempt, isCorrect]);

  // Handle timeout for showing hints
  useEffect(() => {
    if (!target) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - target.startTime;
      if (elapsed > TIME_LIMIT_MS && !isTimedOut && !isCorrect) {
        setIsTimedOut(true);
      }
    }, ANIMATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [target, isCorrect, isTimedOut]);

  return (
    <GameContext.Provider
      value={{
        target,
        nextTarget,
        isCorrect,
        isFailed,
        isTimedOut,
        moveToNextTarget,
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
