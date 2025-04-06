// src/components/MidiInputSelector/MidiInputSelector.tsx
import { useMidiContext } from '../../contexts/MidiContext';

const MidiInputSelector = () => {
  const { inputs, selectedInput, selectInput, isEnabled, error } = useMidiContext();
  
  if (!isEnabled) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
        WebMidi is not enabled. {error && <span>{error}</span>}
      </div>
    );
  }
  
  if (inputs.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-md">
        No MIDI inputs detected. Please connect a MIDI device and refresh the page.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="midi-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select MIDI Input
          </label>
          <select
            id="midi-input"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600
                      dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 
                      focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedInput?.id || ''}
            onChange={(e) => selectInput(e.target.value)}
          >
            <option value="" disabled>Select your MIDI device</option>
            {inputs.map((input) => (
              <option key={input.id} value={input.id}>
                {input.name} {input.manufacturer ? `(${input.manufacturer})` : ''}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Connection Status
          </div>
          {selectedInput ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600 dark:bg-green-400 mr-2"></span>
              Connected to {selectedInput.name}
            </div>
          ) : (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></span>
              No device selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MidiInputSelector;
