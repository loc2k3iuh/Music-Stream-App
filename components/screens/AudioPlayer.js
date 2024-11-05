// AudioPlayer.js
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Audio } from 'expo-av';

import { setPaused, setDuration, setPosition } from '../tools/actions';
import useAudio from '../orthers/useAudio';
import { useAudioContext } from '../orthers/AudioContext';

const AudioPlayer = () => {

  const currentSong = useSelector((state) => state.currentSong);
  const isPaused = useSelector((state) => state.isPaused);
  const duration = useSelector((state) => state.duration);
  const position = useSelector((state) => state.position);

  const dispatch = useDispatch();
  const soundRef = useAudioContext();
  const isLoading = useRef(false);
  const isPlaying = useRef(false); // Theo dõi trạng thái phát
  const positionInterval = useRef(null);

  const { seekToPosition } = useAudio();

  useEffect(() => {
    const loadAndPlaySound = async () => {
        if (isLoading.current) return; // Ngăn chặn việc tải nhiều lần
        isLoading.current = true;
      
        try {
            // Nếu có bài hát hiện tại
            if (currentSong) {
                // Dừng và giải phóng âm thanh cũ nếu đã phát
                if (isPlaying.current) {
                    await soundRef.current.stopAsync();
                    await soundRef.current.unloadAsync();
                }
        
                // Tải âm thanh mới
                await soundRef.current.loadAsync({ uri: currentSong.url_play });
                console.log("Loaded sound", currentSong.url_play);
                console.log("Test", currentSong);
                const status = await soundRef.current.getStatusAsync();
                console.log("Set duration:", status.durationMillis);
                dispatch(setDuration(status.durationMillis)); // Cập nhật thời lượng
                dispatch(setPosition(0)); //Set vị trí ban đầu là 0

                isPlaying.current = false;
        
                // Phát âm thanh nếu không bị tạm dừng
                if (!isPaused&&soundRef.current._loaded) {
                    try {
                        await soundRef.current.playAsync(); // Chỉ phát nếu âm thanh đã tải thành công
                        isPlaying.current = true; // Đánh dấu là đang phát
                        console.log("Playing sound", currentSong.url_play);

                        positionInterval.current = setInterval(async () => {
                            const status = await soundRef.current.getStatusAsync();
                            if (status.isLoaded) {
                              dispatch(setPosition(status.positionMillis)); // Cập nhật vị trí
                            }
                        }, 1000); // Cập nhật mỗi giây
                    } catch (playError) {
                        console.error('Error while trying to play sound:', playError);
                    }
                }
            } else {
                if(isPlaying.current) {
                    // Nếu không có bài hát, dừng âm thanh
                    await soundRef.current.stopAsync();
                    console.log("Stop sound", currentSong.url_play);
                    isPlaying.current = false;
                }
            }
        } catch (error) {
            console.error('Error loading or playing sound:', error);
            console.log('details: ',error.message);
            dispatch(setPaused(true)); // Tạm dừng nếu có lỗi
        } finally {
            isLoading.current = false; // Cập nhật trạng thái tải
        }
      };

    console.log(1);

    loadAndPlaySound();

    return () => {
        const stopAndUnload = async () => {
                if (isPlaying.current) {
                    await soundRef.current.stopAsync(); // Dừng âm thanh
                    console.log("Cleanup: Stopped sound", currentSong ? currentSong.url_play : "No song");
                }
                await soundRef.current.unloadAsync(); // Giải phóng tài nguyên
                isPlaying.current = false; // Cập nhật trạng thái phát
          };
          stopAndUnload();
    };
  }, [currentSong, dispatch]);

  useEffect(() => {
    const managePlayback = async () => {
      try {
        if (soundRef.current._loaded) {
            if (isPaused) {
                if (isPlaying.current) {
                    await soundRef.current.pauseAsync(); // Tạm dừng âm thanh
                    isPlaying.current = false; // Cập nhật trạng thái phát
                    console.log("Paused sound", currentSong.url_play);
                }
            } else {
                if (!isPlaying.current) {
                    const currentPosition = await soundRef.current.getStatusAsync().then(status => status.positionMillis);
                    await soundRef.current.playFromPositionAsync(currentPosition); // Tiếp tục phát âm thanh
                    isPlaying.current = true; // Cập nhật trạng thái phát
                    console.log("Resumed sound", currentSong.url_play);
                }
            }
        }else {
            console.log("Sound not loaded yet:", currentSong.url_play);
        }
      } catch (error) {
        // console.error('Error managing playback:', error);
        // console.log("Error managing:", currentSong.url_play);
      }
    };

    managePlayback();
  }, [isPaused, currentSong]);

    const handleSlidingComplete = (value) => {
        const newPosition = value * duration; // duration từ Redux hoặc props
        seekToPosition(newPosition);
        console.log("Seek to position:", newPosition);
    };

  return null; // AudioPlayer không cần render gì
};

export default AudioPlayer;