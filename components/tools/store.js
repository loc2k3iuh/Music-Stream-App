import {createStore} from 'redux';
import { SET_CURRENT_SONG, SET_PAUSED, SET_DURATION, SET_POSITION } from './actions';

<<<<<<< HEAD
const initialState = {
    currentSong: null,
    isPaused: false,
=======

const initialState = {
    currentSong: null,
    isPaused: false
>>>>>>> origin/khang
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_LOGIN':
            return {
                ...state,
                isLoggedIn: action.payload 
            };
        case 'SET_USER_DATA':
            return { ...state,
                userData: action.payload 
            };
        case SET_CURRENT_SONG:
            return {
                ...state,
                currentSong: action.payload,
            };
        case 'PLAY_SONG':
            return {
                ...state,
                currentSong: action.payload,
                isPlaying: true 
            };
        case SET_PAUSED:
            return {
                ...state,
                isPaused: action.payload
            };
        case SET_DURATION:
            return {
                ...state,
                duration: action.payload
            };
        case SET_POSITION:
            return {
                ...state,
                position: action.payload
            };
        case 'STOP_SONG':
            return {
                ...state,
                currentSong: null,
                isPlaying: false,
            }
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;