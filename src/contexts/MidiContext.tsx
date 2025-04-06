// src/contexts/MidiContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useMidi } from '../hooks/useMidi';
import { MidiNote, MidiInputDevice } from '../types/midi';
import { Input } from 'webmidi';

interface MidiContextType {
  isEnabled: boolean;
  inputs: MidiInputDevice[];
  activeNotes: MidiNote[];
  selectedInput: Input | null;
  selectInput: (inputId: string) => void;
  error: string | null;
}

const MidiContext = createContext<MidiContextType | undefined>(undefined);

export const MidiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const midiState = useMidi();

  return (
    <MidiContext.Provider value={midiState}>
      {children}
    </MidiContext.Provider>
  );
};

export const useMidiContext = (): MidiContextType => {
  const context = useContext(MidiContext);
  if (context === undefined) {
    throw new Error('useMidiContext must be used within a MidiProvider');
  }
  return context;
};
