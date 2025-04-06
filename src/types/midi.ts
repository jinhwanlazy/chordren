export interface MidiNote {
  number: number;  // MIDI note number (0-127)
  velocity: number;  // Note velocity (0-127)
  name: string;  // Note name (e.g., "C4")
  octave: number;  // Note octave
  //noteName: string;  // Note name without octave (e.g., "C")
  invalidated: boolean;
}

export interface MidiInputDevice {
  id: string;
  name: string;
  manufacturer?: string;
}
