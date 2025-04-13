import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { chordToString } from '../../utils/chordUtils';

const chordNameColor = (isCorrect: boolean, isFailed: boolean, isTimedOut: boolean) => {
  if (isCorrect) return 'text-green-500';
  if (isFailed || isTimedOut) return 'text-red-500';
  return '';
}

const message = (isCorrect: boolean, isFailed: boolean, isTimedOut: boolean) => {
  if (isCorrect) {
    if (isFailed) return "Nice! Don't guess next time!";
    if (isTimedOut) return "Good! Try to remember the notes next time!";
    return "Great!";
  } else {
    if (isFailed) return "Wrong notes!";
    if (isTimedOut) return "Time's up!";
  }
  return "Play this chord!";
}

const messageColor = (isCorrect: boolean, isFailed: boolean, isTimedOut: boolean) => {
  if (isFailed || isTimedOut) return 'text-red-500';
  if (isCorrect) return 'text-green-500';
  return '';
}


const ChordDisplay: React.FC = () => {
  const { target, isCorrect, isFailed, isTimedOut } = useGameContext();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`mt-4 text-2xl ${messageColor(isCorrect, isFailed, isTimedOut)}`}>
        {message(isCorrect, isFailed, isTimedOut)}
      </div>

      <div
        className={`text-9xl font-bold transition-colors duration-300 ${chordNameColor(isCorrect, isFailed, isTimedOut)}`}
      >
        {target ? chordToString(target.chord) : 'Loading...'}
      </div>
    </div>
  );
};

export default ChordDisplay;
