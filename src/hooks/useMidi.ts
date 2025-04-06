// src/hooks/useMidi.ts
import { useState, useEffect, useCallback } from 'react';
import { WebMidi, Input } from 'webmidi';
import { MidiNote, MidiInputDevice } from '../types/midi';

// Local storage key for saving selected input
const STORAGE_KEY = 'selectedMidiInputId';

export const useMidi = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [inputs, setInputs] = useState<MidiInputDevice[]>([]);
  const [activeNotes, setActiveNotes] = useState<MidiNote[]>([]);
  const [selectedInput, setSelectedInput] = useState<Input | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Save selected input to localStorage
  const saveSelectedInput = useCallback((inputId: string) => {
    localStorage.setItem(STORAGE_KEY, inputId);
  }, []);

  // Get saved input from localStorage
  const getSavedInputId = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY);
  }, []);

  // Update available inputs
  const updateInputs = useCallback(() => {
    if (!WebMidi.enabled) return;

    const midiInputs = WebMidi.inputs.map(input => ({
      id: input.id,
      name: input.name,
      manufacturer: input.manufacturer
    }));

    setInputs(midiInputs);

    // If the previously selected input is no longer available, clear it
    if (selectedInput && !WebMidi.inputs.some(input => input.id === selectedInput.id)) {
      setSelectedInput(null);
    }
  }, [selectedInput]);

  // Handle note on event
  const handleNoteOn = useCallback((e: any) => {
    console.log(e);
    //const noteDetails = getNoteDetails(e.note.number);
    const newNote: MidiNote = {
      //...noteDetails,
      number: e.note.number,
      velocity: e.note.rawAttack,
      name: e.note.name,
      octave: e.note.octave,
      invalidated: false
    };

    setActiveNotes(prevNotes => {
      // Update velocity if note already exists, otherwise add it
      const existingNoteIndex = prevNotes.findIndex(n => n.number === newNote.number);
      if (existingNoteIndex >= 0) {
        const updatedNotes = [...prevNotes];
        updatedNotes[existingNoteIndex] = newNote;
        return updatedNotes;
      }
      return [...prevNotes, newNote];
    });
  }, []);

  // Handle note off event
  const handleNoteOff = useCallback((e: any) => {
    setActiveNotes(prevNotes =>
      prevNotes.filter(note => note.number !== e.note.number)
    );
  }, []);

  // Connect to a MIDI input
  const connectToInput = useCallback((inputId: string) => {
    if (!WebMidi.enabled) return;

    // Clean up previous input listeners
    if (selectedInput) {
      selectedInput.removeListener('noteon');
      selectedInput.removeListener('noteoff');
    }

    const input = WebMidi.getInputById(inputId);
    if (!input) {
      setError(`Input with ID ${inputId} not found`);
      return false;
    }

    // Set up new input listeners
    input.addListener('noteon', handleNoteOn);
    input.addListener('noteoff', handleNoteOff);

    setSelectedInput(input);
    setActiveNotes([]); // Clear active notes when changing input
    return true;
  }, [selectedInput, handleNoteOn, handleNoteOff]);

  // Auto-connect to saved input or first available
  const autoConnect = useCallback(() => {
    if (!WebMidi.enabled || WebMidi.inputs.length === 0) return;

    const savedInputId = getSavedInputId();

    // Try to connect to saved input
    if (savedInputId) {
      const success = connectToInput(savedInputId);
      if (success) return;
      // If saved input not found, remove it from storage
      localStorage.removeItem(STORAGE_KEY);
    }

    // If no saved input or connection failed, connect to first available
    connectToInput(WebMidi.inputs[0].id);
  }, [getSavedInputId, connectToInput]);

  // Initialize WebMidi
  useEffect(() => {
    WebMidi.enable({ sysex: true })
      .then(() => {
        setIsEnabled(true);
        updateInputs();

        // Auto-connect after inputs are detected
        autoConnect();

        // Listen for device connection/disconnection
        WebMidi.addListener('connected', () => {
          updateInputs();
          // If no input is selected, try to auto-connect to the new device
          if (!selectedInput) {
            autoConnect();
          }
        });
        WebMidi.addListener('disconnected', updateInputs);
      })
      .catch(err => {
        setError(`WebMidi could not be enabled: ${err}`);
      });

    return () => {
      WebMidi.removeListener('connected');
      WebMidi.removeListener('disconnected');
    };
  }, [updateInputs, autoConnect, selectedInput]);

  // Select MIDI input
  const selectInput = useCallback((inputId: string) => {
    if (!WebMidi.enabled) return;

    const success = connectToInput(inputId);
    if (success) {
      // Save selection to localStorage
      saveSelectedInput(inputId);
    }
  }, [connectToInput, saveSelectedInput]);

  return {
    isEnabled,
    inputs,
    activeNotes,
    selectedInput,
    selectInput,
    error
  };
};
