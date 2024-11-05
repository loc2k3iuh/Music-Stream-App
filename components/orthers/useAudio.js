import { useDispatch } from 'react-redux';
import { setPosition, setPaused } from '../tools/actions';
import { useAudioContext } from './AudioContext';

const useAudio = () => {
  const soundRef = useAudioContext();
  const dispatch = useDispatch();

  const seekToPosition = async (newPosition) => {
    try {
      if (soundRef.current && soundRef.current._loaded) {
        await soundRef.current.playFromPositionAsync(newPosition);
        dispatch(setPosition(newPosition));
        dispatch(setPaused(false));
        console.log('Seeking to position:', newPosition);
      } else {
        console.warn('Sound not loaded yet.');
      }
    } catch (error) {
      console.error('Error seeking to position:', error);
    }
  };

  return { seekToPosition };
};

export default useAudio;