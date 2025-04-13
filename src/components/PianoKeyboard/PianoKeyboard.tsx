// PianoKeyboard.tsx
import React, { useRef, useState, useEffect } from 'react';
import PianoKey, { KeyState } from './PianoKey';
import { isWhiteKey } from '../../utils/noteUtils';
import { useGameContext } from '../../contexts/GameContext';
import { useMidiContext } from '../../contexts/MidiContext';

// Standard sizes and configurations
const BASE_WHITE_KEY_WIDTH = 25; // in pixels
const KEYBOARD_SIZES = [25, 37, 49, 61, 88];
const KEYBOARD_RANGES = {
  25: { start: 48, end: 72 },   // C3 to C5
  37: { start: 48, end: 84 },   // C3 to C6
  49: { start: 36, end: 84 },   // C2 to C6
  61: { start: 36, end: 96 },   // C2 to C7
  88: { start: 21, end: 108 },  // A0 to C8
};

const PianoKeyboard: React.FC = () => {
  const { target, isCorrect, isTimedOut } = useGameContext();
  const { activeNotes } = useMidiContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyWidths, setKeyWidths] = useState({
    white: BASE_WHITE_KEY_WIDTH,
    black: BASE_WHITE_KEY_WIDTH * 0.6 });
  const [keyboardSize, setKeyboardSize] = useState(49); // Default size
  const [notes, setNotes] = useState<number[]>([]);
  const [hintedNotes, setHintedNotes] = useState<number[]>([]);

  // Calculate appropriate keyboard size and adjust notes
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const keyboardSize = containerWidth / BASE_WHITE_KEY_WIDTH / 0.59;
        const bestKeyboardSize = KEYBOARD_SIZES.reduce((prev, curr) =>
          Math.abs(curr - keyboardSize) < Math.abs(prev - keyboardSize) ? curr : prev
        );
        console.log(containerWidth, keyboardSize, bestKeyboardSize);

        const { start, end } = KEYBOARD_RANGES[bestKeyboardSize as keyof typeof KEYBOARD_RANGES];
        setNotes(Array.from({ length: end - start + 1 }, (_, i) => i + start));

        const whiteKeyCount = Array.from({ length: end - start + 1 }, (_, i) => i + start)
          .filter(note => isWhiteKey(note)).length;
        const adjustedWhiteKeyWidth = containerWidth / whiteKeyCount;

        setKeyboardSize(bestKeyboardSize);
        setKeyWidths({
          white: adjustedWhiteKeyWidth,
          black: adjustedWhiteKeyWidth * 0.6
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update hinted notes when target chord changes
  useEffect(() => {
    if (isCorrect || !target || !isTimedOut) {
      setHintedNotes([]);
      return;
    }

    const keyboardRange = KEYBOARD_RANGES[keyboardSize as keyof typeof KEYBOARD_RANGES];
    let offset = Math.floor((keyboardRange.start + keyboardRange.end) / 2 / 12) * 12;
    const root = target.chord.root + offset;
    let hintedNotes = target.chord.notes.map(note => {
      while (note < root) {
        note += 12;
      }
      return note;
    });
    if (Math.max(...hintedNotes) > keyboardRange.end) {
      hintedNotes = hintedNotes.map(note => note - 12);
    }
    setHintedNotes(hintedNotes);
  }, [target, keyboardSize, isCorrect, isTimedOut]);

  const isNoteActive = (note: number) => {
    return activeNotes.some(activeNote => activeNote.number === note);
  };

  const keyState = (note: number) => {
    if (isNoteActive(note)) {
      if (target === null) {
        return KeyState.Active;
      }
      else if (target.chord.notes.has(note % 12)) {
        return KeyState.Correct;
      }
      else {
        return KeyState.Wrong;
      }
    }
    if (hintedNotes.includes(note)) {
      return KeyState.Hinted;
    }
    return KeyState.Default;
  }

  return (
    <div className="w-full overflow-x-auto" ref={containerRef}>
      <div className="flex justify-center my-8">
        <div className="flex relative">
          {notes.map((note) => (
            <PianoKey
              key={note}
              note={note}
              state={keyState(note)}
              whiteKeyWidth={keyWidths.white}
              blackKeyWidth={keyWidths.black}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PianoKeyboard;
