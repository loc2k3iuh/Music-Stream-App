import TrackPlayer from 'react-native-track-player';

module.exports = async function() {
    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());
    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());
    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.stop());
    TrackPlayer.addEventListener('remote-next', () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener('remote-previous', () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener('remote-seek', (event) => TrackPlayer.seekTo(event.position));
    TrackPlayer.addEventListener('remote-jump-forward', (event) => TrackPlayer.seekTo(event.position));
    TrackPlayer.addEventListener('remote-jump-backward', (event) => TrackPlayer.seekTo(event.position));
    TrackPlayer.addEventListener('remote-duck', () => TrackPlayer.setVolume(0.5));
    TrackPlayer.addEventListener('remote-unduck', () => TrackPlayer.setVolume(1));
};