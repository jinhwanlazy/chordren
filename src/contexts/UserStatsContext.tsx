// contexts/UserStatsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chord, chordToString } from '../utils/chordUtils';

// Basic stats for a chord
interface ChordStat {
  chordId: string;
  attempts: number;
  successes: number;
  averageResponseTime: number;
}

interface UserStatsContextType {
  chordStats: Record<string, ChordStat>;
  recordAttempt: (chord: Chord, startTime: number, now: number) => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

const MAX_RESPONSE_TIME = 10000;

export const UserStatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chordStats, setChordStats] = useState<Record<string, ChordStat>>({});

  const recordAttempt = (chord: Chord, startTime: number, now: number) => {
    const chordId = chordToString(chord);
    const responseTimeMs = now - startTime;
    const success = responseTimeMs <= MAX_RESPONSE_TIME;
    console.log(chordId, success, responseTimeMs);

    setChordStats(prev => {
      const existing = prev[chordId] || {
        chordId,
        attempts: 0,
        successes: 0,
        averageResponseTime: 0
      };

      const newStat = {
        ...existing,
        attempts: existing.attempts + 1,
        successes: success ? existing.successes + 1 : existing.successes
      };

      // Update average response time if this was a success and time was provided
      if (success && responseTimeMs) {
        const totalTimeForPreviousSuccesses = existing.averageResponseTime * existing.successes;
        newStat.averageResponseTime = (totalTimeForPreviousSuccesses + responseTimeMs) / newStat.successes;
      }

      return {
        ...prev,
        [chordId]: newStat
      };
    });
  };

  return (
    <UserStatsContext.Provider
      value={{
        chordStats,
        recordAttempt
      }}
    >
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStatsContext = (): UserStatsContextType => {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error('useUserStats must be used within a UserStatsProvider');
  }
  return context;
};
