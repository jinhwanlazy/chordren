import { Accidental, NoteSet, noteToString } from './noteUtils';

export enum ChordType {
  Maj = 'maj',
  Min = 'min',
  Dim = 'dim',
  Aug = 'aug',
  Sus4 = 'sus4',

  Maj7 = 'maj7',
  Min7 = 'min7',
  Dom7 = '7',
  Min7b5 = 'm7b5',
  Dim7 = 'dim7',
  MinMaj7 = 'mM7',
  Aug7 = 'aug7',
  Dom7Sus4 = '7sus4',

  Maj6 = '6',
  Min6 = 'min6',
}

export const allChordTypes = Object.values(ChordType);

export interface Chord {
  notes: NoteSet;
  root: number;
  chordType: ChordType;
  indices: [number, string][];
  accidental?: Accidental;
}

const noteIntervalsOfChordType: [ChordType, number[]][] = [
  [ChordType.Maj, [0, 4, 7]],
  [ChordType.Min, [0, 3, 7]],
  //[ChordType.Dim, [0, 3, 6]],
  //[ChordType.Aug, [0, 4, 8]],
  //[ChordType.Sus4, [0, 5, 7]],

  //[ChordType.Maj7, [0, 4, 7, 11]],
  //[ChordType.Dom7, [0, 4, 7, 10]],
  //[ChordType.Min7, [0, 3, 7, 10]],
  //[ChordType.Min7b5, [0, 3, 6, 10]],
  //[ChordType.Dim7, [0, 3, 6, 9]],
  //[ChordType.MinMaj7, [0, 3, 7, 11]],
  //[ChordType.Aug7, [0, 4, 8, 10]],
  //[ChordType.Dom7Sus4, [0, 5, 7, 10]],

  //[ChordType.Maj6, [0, 4, 7, 9]],
  //[ChordType.Min6, [0, 3, 7, 9]],
];

function getNoteIntervals(chordType: ChordType): number[] {
  const found = noteIntervalsOfChordType.find(([type]) => type === chordType);
  return found ? found[1] : [];
}

function getValidIndices(chord: Chord): [number, string][] {
  const indices: [number, string][] = [];
  const intervals = getNoteIntervals(chord.chordType);

  // Basic chord
  indices.push([
    new NoteSet(intervals.map(interval => (chord.root + interval) % 12)).toNumber(),
    ''
  ]);

  //// Allow omit P5
  //if (intervals[2] === 7) {
    //const intervalsWithoutP5 = [...intervals.slice(0, 2), ...intervals.slice(3)];
    //indices.push([
      //new NoteSet(intervalsWithoutP5.map(interval => (chord.root + interval) % 12)).toNumber(),
      //'omit5'
    //]);
  //}

  //// Allow rootless voicing
  //indices.push([
    //new NoteSet(intervals.slice(1).map(interval => (chord.root + interval) % 12)).toNumber(),
    //'omit1'
  //]);

  //// Allow guide tone voicing (omit P1 and P5)
  //if (intervals.length >= 4 && intervals[2] === 7) {
    //const guideToneInterval = [...intervals.slice(1, 2), ...intervals.slice(3)];
    //indices.push([
      //new NoteSet(guideToneInterval.map(interval => (chord.root + interval) % 12)).toNumber(),
      //'guide'
    //]);
  //}

  return indices;
}

export const allChords: Chord[] = noteIntervalsOfChordType.flatMap(([chordType]) =>
  Array.from({ length: 12 }, (_, root) => {
    const intervals = getNoteIntervals(chordType);
    const chord = {
      notes: new NoteSet(intervals.map(interval => (root + interval) % 12)),
      root,
      chordType,
      indices: [] as [number, string][]
    };
    chord.indices = getValidIndices(chord);
    return chord;
  })
);

export function chordTypeToString(chordType: ChordType, skipMajor = true): string {
  switch (chordType) {
    case ChordType.Maj: return skipMajor ? '' : 'Δ';
    case ChordType.Min: return 'm';
    case ChordType.Dim: return '°';
    case ChordType.Aug: return '+';
    case ChordType.Sus4: return 'sus4';
    case ChordType.Maj7: return 'maj7';
    case ChordType.Dom7: return '7';
    case ChordType.Min7: return 'm7';
    case ChordType.Min7b5: return 'm7b5';
    case ChordType.Dim7: return 'dim7';
    case ChordType.MinMaj7: return 'mMaj7';
    case ChordType.Aug7: return 'aug7';
    case ChordType.Dom7Sus4: return '7sus4';
    case ChordType.Maj6: return '6';
    case ChordType.Min6: return 'm6';
    default: return '';
  }
}

export function chordToString(chord: Chord): string {
  let symbol = '';
  symbol += noteToString(chord.root, false, chord.accidental || 'random');
  symbol += chordTypeToString(chord.chordType);
  return symbol;
}

// Create a dictionary for quick chord lookup
export const chordDictionary: Map<number, Chord[]> = new Map();
for (let i = 0; i < 10; i++) {
  for (const chord of allChords) {
    if (chord.indices.length > i) {
      const index = chord.indices[i][0];
      if (!chordDictionary.has(index)) {
        chordDictionary.set(index, []);
      }
      chordDictionary.get(index)?.push(chord);
    }
  }
}

export function findChords(notes: NoteSet): Chord[] {
  if (notes.size < 2) {
    return [];
  }
  const index = new NoteSet(notes.map(note => note % 12)).toNumber();
  return chordDictionary.get(index) || [];
}

export function findChord(notes: NoteSet): Chord | undefined {
  const candidates = findChords(notes);
  if (candidates.length === 0) {
    return undefined;
  }

  for (const chord of candidates) {
    const bottomNote = notes.bottomNote !== undefined ? notes.bottomNote % 12 : -1;
    if (chord.root === bottomNote) {
      return chord;
    }
  }
  return candidates[0];
}

export function validateNotes(chord: Chord, notes: NoteSet, strict = true): boolean {
  if (notes.size < 2) {
    return false;
  }
  const index = new NoteSet(notes.map(note => note % 12)).toNumber();
  for (const [chordIndex, ] of chord.indices) {
    if (index === chordIndex) {
      return true;
    }
  }
  return false;
}
