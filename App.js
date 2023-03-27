import React from 'react';
import { NavigationContainer  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GameBoard from './GameBoard';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // The Stack Navigator is not needed here but will likely be useful during the assignment.
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={GameBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
