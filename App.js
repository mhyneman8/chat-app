import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Start from './components/Start';
import Chat from './components/Chat';

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {

    return (
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Start.js"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />

          <Stack.Screen
            name="Chat"
            component={Chat}
          />

        </Stack.Navigator>
      </NavigationContainer>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
