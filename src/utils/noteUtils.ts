export type Note = number;
export type Accidental = '#' | 'b';

export function noteToString(note: Note, includeOctave = false, accidental: Accidental | 'random' = 'random'): string {
  const noteNames = 'C D EF G A B';
  let name = noteNames[note % 12];
  if (name === ' ') {
    if (accidental === 'random') {
      accidental = Math.random() < 0.5 ? '#' : 'b';
    }
    if (accidental === '#') {
      name = `${noteNames[(note - 1) % 12]}♯`;
    } else {
      name = `${noteNames[(note + 1) % 12]}♭`;
    }
  }
  if (includeOctave) {
    const octave = Math.floor(note / 12) - 1;
    if (octave >= 0) {
      name += octave;
    }
  }
  return name;
}

export const isBlackKey = (noteNumber: number): boolean => {
  const noteIndex = noteNumber % 12;
  return [1, 3, 6, 8, 10].includes(noteIndex);
};

export function isWhiteKey(note: number) {
    return !isBlackKey(note);
}

export class NoteSet implements Iterable<Note> {
  private notes: Note[] = [];

  constructor(initialValues?: Iterable<Note>) {
    if (initialValues) {
      for (const value of initialValues) {
        this.add(value);
      }
    }
  }

  add(value: Note): this {
    const index = this.binarySearch(value);
    if (this.notes[index] !== value) {
      this.notes.splice(index, 0, value);
    }
    return this;
  }

  has(value: Note): boolean {
    const index = this.binarySearch(value);
    return this.notes[index] === value;
  }

  delete(value: Note): boolean {
    const index = this.binarySearch(value);
    if (this.notes[index] === value) {
      this.notes.splice(index, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this.notes = [];
  }

  get size(): number {
    return this.notes.length;
  }

  private binarySearch(value: Note): number {
    let low = 0;
    let high = this.notes.length;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.notes[mid] < value) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return low;
  }

  [Symbol.iterator](): Iterator<Note> {
    return this.notes[Symbol.iterator]();
  }

  forEach(callbackfn: (value: Note, index: number, array: Note[]) => void): void {
    this.notes.forEach(callbackfn);
  }

  map<U>(callbackfn: (value: Note, index: number, array: Note[]) => U): U[] {
    return this.notes.map(callbackfn);
  }

  filter(predicate: (value: Note, index: number, array: Note[]) => boolean): Note[] {
    return this.notes.filter(predicate);
  }

  toNumber(): number {
    return this.notes.reduce((acc, note) => acc | (1 << (note % 12)), 0);
  }

  get bottomNote(): Note | undefined {
    return this.notes.length > 0 ? this.notes[0] : undefined;
  }

  get topNote(): Note | undefined {
    return this.notes.length > 0 ? this.notes[this.notes.length - 1] : undefined;
  }
}
