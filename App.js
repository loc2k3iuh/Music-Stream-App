import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LaunchScreen from './components/screens/LaunchScreen';
import HomeScreen from './components/screens/HomeScreen';
import SongScreen from './components/screens/SongScreen';
import AudioPlayer from './components/screens/AudioPlayer';
import AlbumScreen from './components/screens/AlbumScreen';
import ChartScreen from './components/screens/ChartScreen';

{/* Context */}
import { AudioProvider } from './components/orthers/AudioContext';

import store from './components/tools/store';

const Stack = createStackNavigator();

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
      <Stack.Navigator>
        {isLoggedIn ? (
            <>
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ headerShown: false }} />
                <Stack.Screen 
                    name="Song" 
                    component={SongScreen} 
                    options={{ headerShown: false }}  />
                <Stack.Screen 
                    name="Album" 
                    component={AlbumScreen} 
                    options={{ headerShown: false }}  />
                <Stack.Screen 
                    name="Chart" 
                    component={ChartScreen} 
                    options={{ headerShown: false }}  />
            </>
        ) : (
          <Stack.Screen 
              name="Launch" 
              options={{ headerShown: false }} 
          >
              {props => <LaunchScreen {...props} />} 
          </Stack.Screen>
        )}
      </Stack.Navigator>
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