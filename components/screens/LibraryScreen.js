import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MyLibrary from './MyLibrary/YourLibrary';
import ListLibrary from './MyLibrary/ListLibrary';


const Stack = createStackNavigator();

function LibraryStack() {
  return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyLibrary" component={MyLibrary}  options={{headerShown: false}} />
        <Stack.Screen name="ListLibrary" component={ListLibrary}  options={{headerShown: false}} />
      </Stack.Navigator>      


  );
}

export default LibraryStack;
