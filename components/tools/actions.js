export const SET_CURRENT_SONG = 'SET_CURRENT_SONG';
export const SET_PAUSED = 'SET_PAUSED';
export const SET_DURATION = 'SET_DURATION';
export const SET_POSITION = 'SET_POSITION';

export const setCurrentSong = (song) => {
  return {
    type: SET_CURRENT_SONG,
    payload: song,
  };
};

export const setPaused = (isPaused) => ({
    type: SET_PAUSED,
    payload: isPaused,
});

export const setDuration = (duration) => ({
  type: SET_DURATION,
  payload: duration,
});

export const setPosition = (position) => ({
  type: SET_POSITION,
  payload: position,
});
