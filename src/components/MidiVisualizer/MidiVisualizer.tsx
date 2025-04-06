// src/components/MidiVisualizer/MidiVisualizer.tsx
import { useMidiContext } from '../../contexts/MidiContext';

const MidiVisualizer = () => {
  const { activeNotes } = useMidiContext();
  
  if (activeNotes.length === 0) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400 text-center">
        No MIDI notes detected. Play something on your MIDI device.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {activeNotes.map((note) => (
          <div 
            key={note.number} 
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 
                       px-3 py-1 rounded-md flex items-center justify-between shadow-sm"
            style={{ 
              opacity: Math.max(0.5, note.velocity),
              minWidth: '80px'
            }}
          >
            <span className="font-medium">{note.name}{note.octave}</span>
            <span className="text-xs ml-2 opacity-70">
              {note.number} | {Math.round(note.velocity / 127 * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MidiVisualizer;
