import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LaunchScreen from './components/screens/LaunchScreen';
import HomeScreen from './components/screens/HomeScreen';
import SearchScreen from './components/screens/SearchScreen';
import FeedScreen from './components/screens/FeedScreen';
import LibraryScreen from './components/screens/LibraryScreen';

import ChartScreen from './components/screens/ChartScreen';
import AlbumScreen  from './components/screens/AlbumScreen';
import SongScreen from './components/screens/SongScreen';
import ArtistScreen from './components/screens/ArtistScreen';

import AudioPlayer from './components/screens/AudioPlayer';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faUserCircle, faBookOpen } from '@fortawesome/free-solid-svg-icons';

{/* Context */}
import { AudioProvider } from './components/orthers/AudioContext';

import store from './components/tools/store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{
                    headerShown: false}} />
            <Stack.Screen 
                name="Chart" 
                component={ChartScreen}
                options={{
                    headerShown: false}} />
            <Stack.Screen 
                name="Album" 
                component={AlbumScreen}
                options={{
                    headerShown: false}} />
            <Stack.Screen 
                name="Song"
                component={SongScreen}
                options={{
                    headerShown: false}} />
            <Stack.Screen 
                name="Artist" 
                component={ArtistScreen}
                options={{
                    headerShown: false}} />
        </Stack.Navigator>
    );
}

const AppNavigator = () => {

    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);

    {/* Kiểm tra trạng thái đăng nhập */}
    useEffect(() => {
        const checkLoginStatus = async () => {
            // Kiểm tra token trong AsyncStorage
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                const userData = JSON.parse(userToken); 
                dispatch({ type: 'SET_LOGIN', payload: true });
                dispatch({ type: 'SET_USER_DATA', payload: userData });
            } else {
                dispatch({ type: 'SET_LOGIN', payload: false }); 
            }
        };

        checkLoginStatus(); 
    }, [dispatch]);

    return (
        <Tab.Navigator>
        {isLoggedIn ? (
            <>
                <Tab.Screen 
                    name="Home" 
                    component={HomeStack} 
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faHome} size={15} color={color} />
                        ),
                    tabBarLabel: 'Trang chủ',
                    }} />
                <Tab.Screen 
                    name="Search" 
                    component={SearchScreen} 
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faSearch} size={15} color={color} />
                        ),
                    tabBarLabel: 'Tìm kiếm',
                    }}
                     />
                <Tab.Screen 
                    name="Feed" 
                    component={FeedScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faUserCircle} size={15} color={color} />
                        ),
                    tabBarLabel: 'Feed',
                    }} />
                <Tab.Screen 
                    name="Library" 
                    component={LibraryScreen} 
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesomeIcon icon={faBookOpen} size={15} color={color} />
                        ),
                    tabBarLabel: 'Thư viện',
                    }} />
            </>
        ) : (
            <Tab.Screen 
                name="Launch" 
                component={LaunchScreen} 
                options={{ headerShown: false }} />
        )}
    </Tab.Navigator>
    );
}

export default function App() {

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <AudioProvider>
                    <NavigationContainer>
                        <AudioPlayer />
                        <AppNavigator />
                    </NavigationContainer>
                </AudioProvider>
            </SafeAreaProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});