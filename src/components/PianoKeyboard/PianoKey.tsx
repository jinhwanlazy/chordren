// PinanoKey.tsx
import React from 'react';
import { isWhiteKey } from '../../utils/noteUtils';

export enum KeyState {
  Default,
  Active,
  Hinted,
  Correct,
  Wrong
}

export interface PianoKeyProps {
  note: number;
  state: KeyState;
  onClick?: () => void;
  whiteKeyWidth: number;
  blackKeyWidth: number;
}

const keyLeftMargin = (note: number, isWhite: boolean, whiteKeyWidth: number, blackKeyWidth: number) => {
  if (isWhite) return 0;
  if (note % 12 === 1 || note % 12 === 6)
    return `${-whiteKeyWidth * 0.4}px`;
  else if (note % 12 === 8)
    return `${-blackKeyWidth * 0.5}px`;
  else
    return `${-whiteKeyWidth * 0.2}px`;
}

const keyRightMargin = (note: number, isWhite: boolean, whiteKeyWidth: number, blackKeyWidth: number) => {
  if (isWhite) return 0;
  if (note % 12 === 3 || note % 12 === 10)
    return `${-whiteKeyWidth * 0.4}px`;
  else if (note % 12 === 8)
    return `${-blackKeyWidth * 0.5}px`;
  else
    return `${-whiteKeyWidth * 0.2}px`;
}

const keyColor = (isWhite: boolean, state: KeyState) => {
  const baseClass = isWhite ? 'h-24 border-r border-gray-300' : 'h-16 z-10';

  switch (state) {
    case KeyState.Active:
      return baseClass + ' bg-blue-500 text-white';
    case KeyState.Hinted:
      return isWhite
        ? baseClass + ' animate-blink-white'
        : baseClass + ' animate-blink-black';
    case KeyState.Correct:
      return baseClass + ' bg-green-500 text-white';
    case KeyState.Wrong:
      return baseClass + ' bg-red-500 text-white';
    case KeyState.Default:
    default:
      return isWhite
        ? baseClass + ' bg-white text-gray-900'
        : baseClass + ' bg-gray-800 text-white';
  }
}

const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  state,
  onClick,
  whiteKeyWidth,
  blackKeyWidth
}) => {
  // Key styles based on state
  const isWhite = isWhiteKey(note);
  const keyStyle = {
    width: isWhite ? `${whiteKeyWidth}px` : `${blackKeyWidth}px`,
    marginLeft: keyLeftMargin(note, isWhite, whiteKeyWidth, blackKeyWidth),
    marginRight: keyRightMargin(note, isWhite, whiteKeyWidth, blackKeyWidth),
  };

  return (
    <div
      className={`relative ${keyColor(isWhite, state)} cursor-pointer transition-colors duration-150 flex items-end justify-center pb-2`}
      style={keyStyle}
      onClick={onClick}
    >
    </div>
  );
};

export default PianoKey;
