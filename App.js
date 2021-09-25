import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Start from './components/Start';
import Chat from './components/Chat';

const firebase = require('firebase');
require('firebase/firestore');

const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {

    const firebaseConfig = {
      apiKey: "AIzaSyD7a6pt01znYSszV3F55SilVP20wh93vi0",
      authDomain: "chatme-1b0ed.firebaseapp.com",
      projectId: "chatme-1b0ed",
      storageBucket: "chatme-1b0ed.appspot.com",
      messagingSenderId: "748171865694",
      appId: "1:748171865694:web:316e4170ee00c02fa90ecf",
      measurementId: "G-Z3QRMQ3XR4"
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

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
