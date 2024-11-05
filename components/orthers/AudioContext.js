import React, { createContext, useContext, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const soundRef = useRef(new Audio.Sound());

  return (
    <AudioContext.Provider value={soundRef}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
    return useContext(AudioContext);
};