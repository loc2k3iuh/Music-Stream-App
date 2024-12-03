import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { setCurrentSong, setPaused } from '../tools/actions'; // Import action

{/* Font Awesome 5 */}
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown, faRandom, faStepBackward, faStepForward, faPause, faPlay, faHeart, faSync, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

import useAudio from '../orthers/useAudio';

const SongScreen = ({ route }) => {
    
    const dispatch = useDispatch();
    const currentSong = useSelector((state) => state.currentSong);
    const isPaused = useSelector((state) => state.isPaused);
    const duration = useSelector((state) => state.duration);
    const position = useSelector((state) => state.position);

    const { song } = route.params;

    const { seekToPosition } = useAudio();

    const navigation = useNavigation();
    const { top, right, bottom, left } = useSafeAreaInsets();

    const handleSongChange = useCallback(() => {
        if (song && song.id !== currentSong?.id) {
            dispatch(setCurrentSong(song));
            dispatch(setPaused(false));
        }else if(!isPaused) {
            dispatch(setPaused(false));
        }
      }, [song, currentSong, dispatch]);

    useEffect(() => {
        handleSongChange();
    }, [handleSongChange]);

    const handlePlayPausePress = () => {
        dispatch(setPaused(!isPaused));
    };

    const handleSlidingComplete = (value) => {
        const newPosition = value * duration;
        seekToPosition(newPosition);
        console.log("Seek to position:", newPosition);
    };

    return (
        <SafeAreaView style={[styles.container,{
            marginTop: top,
            marginRight: right,
            marginBottom: bottom,
            marginLeft: left
          }]}>
            <Image source={require('../../assets/images/background-play.png')} style={styles.background} />
            <View style={styles.containerMain}>
                <View style={styles.header}>
                    <Text style={styles.titleHeader}>Đang phát</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesomeIcon icon={faAngleDown} style={styles.iconClose} />
                    </TouchableOpacity>
                </View>
                <Image source={{uri: song.thumbnail}} style={styles.poster} />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{song.title}</Text>
                    <Text style={styles.artist}>
                        {song.artists_info.map((artist) => artist.name).join(', ')}
                    </Text>
                    <Image source={require("../../assets/images/audiowave.png")} style={styles.audiowave}></Image>
                    <Slider
                        value={duration > 0 ? position / duration : 0}
                        onSlidingComplete={handleSlidingComplete}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor="#1EB1FC"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#1EB1FC"
                    />
                    <View style={styles.containerDuration}>
                        <Text style={styles.textPosition}>{formatTime(position)}</Text>
                        <Text style={styles.textDuration}>{formatTime(duration)}</Text>
                    </View>
                    <View style={styles.controlsContainer}>
                        <TouchableOpacity
                            style={styles.controlButton}
                        >
                            <FontAwesomeIcon icon={faRandom} style={styles.controlIcon} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.controlButton}
                        >
                            <FontAwesomeIcon icon={faStepBackward} style={styles.controlIcon} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButtonMain} onPress={handlePlayPausePress}>
                            {isPaused ? (
                                <FontAwesomeIcon icon={faPlay} style={styles.controlIconMain} size={23} />
                            ):(
                                <FontAwesomeIcon icon={faPause} style={styles.controlIconMain} size={23} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.controlButton}
                        >
                            <FontAwesomeIcon icon={faStepForward} style={styles.controlIcon} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.controlButton}
                        >
                            <FontAwesomeIcon icon={faSync} style={styles.controlIcon} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footerLeft}>
                            <TouchableOpacity
                                style={styles.controlButton}
                            >
                                <FontAwesomeIcon icon={faHeart} style={styles.controlIcon} size={15} />
                                <Text style={styles.titleControl}>12K</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.controlButton}
                            >
                                <FontAwesomeIcon icon={faComment} style={styles.controlIcon} size={15} />
                                <Text style={styles.titleControl}>450</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerRight}>
                            <TouchableOpacity
                                style={styles.controlButton}
                            >
                                <FontAwesomeIcon icon={faShare} style={styles.controlIcon} size={15} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    audiowave: {
        flex: 1,
        resizeMode: 'stretch',
        justifyContent: 'center',
        height: 100,
        width: '100%',
        marginVertical: 5,
        position: 'relative',
    },
    header: {
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignContent: 'center',
        lineHeight: 40,
    },
    titleHeader: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 40,
        marginLeft: 10,
    },
    iconClose: {
        color: '#fff',
        fontSize: 24,
        lineHeight: 24,
        alignItems: 'center',
        marginRight: 10,
        marginTop: 13,
    },
    infoContainer: {
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        height: '45%',
        position: 'relative',
        bottom: 0,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff'
    },
    artist: {
        fontSize: 13,
        color: '#ccc',
        marginBottom: 8,
    },
    poster: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginVertical: 'auto',
    },
    genre: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 8,
    },
    duration: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 8,
    },
    url: {
        fontSize: 16,
        color: '#ccc',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    containerDuration: {
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between'
    },
    textDuration: {
        fontSize: 12,
        color: 'white'
    },
    textPosition: {
        fontSize: 12,
        color: 'white'
    },
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        width: '100%'
    },
    containerMain: {
        flex: 1,
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
    },
    controlIcon: {
        color: '#fff'
    },
    controlIconMain: {
        color: '#000'
    },
    controlButtonMain: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    footerLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 25,
    },
    controlButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    footerRight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleControl: {
        color: '#fff',
        fontSize: 12,
    }
});

export default SongScreen;