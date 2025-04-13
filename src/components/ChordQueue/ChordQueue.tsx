// src/components/ChordQueue/ChordQueue.tsx
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { chordToString } from '../../utils/chordUtils';

const ChordQueue: React.FC = () => {
  const { target, nextTarget, isCorrect, isFailed, isTimedOut } = useGameContext();
  const [progressPercent, setProgressPercent] = useState(100);

  // Constants
  const TIME_LIMIT_MS = 5000; // 5 seconds timeout
  const PROGRESS_UPDATE_INTERVAL_MS = 33; // ~30fps for smooth animation

  // Progress bar management
  useEffect(() => {
    if (!target) return;

    setProgressPercent(100); // Reset progress when new target appears

    // Determine which start time to use
    const startTime = isCorrect && nextTarget ? nextTarget.startTime : target.startTime;
    if (startTime <= 0) return; // Skip if startTime is not set

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      // Count down from 100% to 0%
      const percent = Math.max(100 - (elapsed / TIME_LIMIT_MS) * 100, 0);
      setProgressPercent(percent);
    };

    // Update progress for smooth animation
    const interval = setInterval(updateProgress, PROGRESS_UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [target, nextTarget, isCorrect]);

  // UI helper functions
  const getMessage = () => {
    if (isCorrect) {
      if (isFailed) return "Nice! Don't guess next time!";
      if (isTimedOut) return "Good! Try to remember the notes next time!";
      return "Great!";
    }

    if (isFailed) return "Wrong notes!";
    if (isTimedOut) return "Time's up!";
    return "Play this chord!";
  };

  const getMessageColor = () =>
    isFailed || isTimedOut ? 'text-red-500' :
    isCorrect ? 'text-green-500' : '';

  const getCurrentChordColor = () =>
    isCorrect ? 'text-green-500' :
    (isFailed || isTimedOut) ? 'text-red-500' : '';

  const getProgressColor = () => {
    if (isCorrect) return 'bg-green-500';
    if (isTimedOut) return 'bg-red-500';
    if (progressPercent < 20) return 'bg-red-500';
    if (progressPercent < 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Status message */}
      <div className={`mb-6 text-2xl font-medium ${getMessageColor()}`}>
        {getMessage()}
      </div>

      {/* Chord display container */}
      <div className="relative w-full max-w-xl">
        {/* Current chord */}
        <div className="flex flex-col items-center">
          <div className={`text-8xl font-bold transition-all duration-300 ${getCurrentChordColor()}`}>
            {target ? chordToString(target.chord) : 'Loading...'}
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full mt-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-100 absolute left-0 top-0`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Next chord preview */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
            Next
          </div>
          <div className="text-4xl font-medium text-gray-400 dark:text-gray-500 transition-all">
            {nextTarget ? chordToString(nextTarget.chord) : '...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChordQueue;
