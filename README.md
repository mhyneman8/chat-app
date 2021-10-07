
# Chat App

This chat app is for mobile devices, built using React Native. This app will provide users with a chat interface and options to share images and their location.

## Authors

- [@MalloryHyneman](https://www.github.com/mhyneman8)

  ## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Background Color Option 1 | ![#090C08](https://via.placeholder.com/10/090C08?text=+) #090C08 |
| Background Color Option 2 | ![#474056](https://via.placeholder.com/10/474056?text=+) #474056 |
| Background Color Option 3 | ![#8A95A5](https://via.placeholder.com/10/8A95A5?text=+) #8A95A5 |
| Background Color Option 4 | ![#B9C6AE](https://via.placeholder.com/10/B9C6AE?text=+) #B9C6AE |


## Deployment

To deploy this project:

#### Clone this repository
git clone https://github.com/mhyneman8/chat-app.git

#### Go to root directory
cd chat-app

#### Install dependencies
npm install

Set up a Firestore Database at https://firebase.google.com/. Details on how to set up the database can be found in the Firebase documentation - https://firebase.google.com/docs 
You will need to replace the firebaseConfig variable in Chat.js with your own database configuration.

#### Run using expo
  expo start

  
## Features

- Page where users can enter their name and choose a background color for the chat screen
- A page displaying the conversation, as well as an input field and submit button
- The chat must provide users with two additional communication features: sending images and location data
- Data gets stored online and offline


  
## Screenshots

![ChatScreen Screenshot](https://github.com/mhyneman8/chat-app/raw/master/img/ChatScreen.jpg)
![HomeScreen Screenshot]('img/HomeScreen.jpg')

  
## Tech Stack

**Client:** React Native

**Server:** Expo, Google Firestore Database, Firebase Cloud Storage

## Dependencies
* expo
* expo-image-picker
* expo-location
* firebase
* netinfo
* prop-types
* react
* react-native
* react-native-async-storage
* react-native-gifted-chat
* react-native-gesture-handler
* react-native-maps
* react-navigation
* react-navigation-stcak
