import { MidiNote } from '../types/midi';

// Convert MIDI note number to note name
//export const getNoteDetails = (noteNumber: number): Omit<MidiNote, 'velocity'> => {
  //const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  //const octave = Math.floor(noteNumber / 12) - 1;
  //const noteName = noteNames[noteNumber % 12];
  //const name = `${noteName}${octave}`;
  
  //return {
    //note: noteNumber,
    //name,
    //octave,
    //noteName,
  //};
//};

//export const isBlackKey = (noteNumber: number): boolean => {
  //const noteIndex = noteNumber % 12;
  //return [1, 3, 6, 8, 10].includes(noteIndex);
//};
