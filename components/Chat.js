import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            uid: 0,
            loggedInText: 'User loggin in...',
            user: {
                _id: '',
                username: '',
                avatar: '',
            },
            isConnected: false,
            image: null,
            location: null,
        };
        
        if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: "AIzaSyBvLZFLnmRtqe530HENKdslztC9OFJTIf4",
            authDomain: "chat-app-3ec44.firebaseapp.com",
            projectId: "chat-app-3ec44",
            storageBucket: "chat-app-3ec44.appspot.com",
            messagingSenderId: "252452088351",
            appId: "1:252452088351:web:df65ee8772009c82d1032a",
            measurementId: "G-JZBJ5SE3Q1"
          });
        }
        // reference messages collection in firebase
        this.referenceMessages = firebase.firestore().collection('messages');
        // set up initial user's messages as null
        this.referenceMessageUser = null;
    }
    // client side get messages from storage
    async getMessages() {
        let messages = '';
        let uid = '';
        try {
            messages = (await AsyncStorage.getItem('messages')) || [];
            uid = await AsyncStorage.getItem('uid');

            this.setState({
                messages: JSON.parse(messages),
                uid: JSON.parse(uid),
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    // updates messages state
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
                // fields are optional. Null if empty
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    };

    // add message to firebase
    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text || null,
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        });
    }

    // client-side storage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    // chat message is sent
    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.saveMessages();
                this.addMessage();
            });
    }  

    renderBubble(props) {
        return (
            <Bubble 
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#957083'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#fff'
                    }
                }}
            />
        )
    }

    // render inputToolbar when online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

        if(status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            }).catch(error => console.log(error));

            if(!result.cancelled) {
                this.setState({
                    image: result
                });
            }
        }
    }

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        
        if(status === 'granted') {
            let result = await Location.getCurrentPositionAsync({});

            if (result) {
                this.setState({
                    location: result
                });
            }
        }
    }

    // returns MapView showing location
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    showUserLocation={true}
                    style={styles.mapView}
                    region={{longitude: Number(currentMessage.location.longitude), 
                        latitude: Number(currentMessage.location.latitude), 
                        longitudeDelta: 0.0021,
                        latitudeDelta: 0.0122}}
                />
            );
        }
        return null;
    }

    renderActions = (props) => {
        return <CustomActions {...props} />
    };


    componentDidMount() {
        const name = this.props.route.params.username;
        this.props.navigation.setOptions({ title: name });

        //check if user is online
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({ 
                    isConnected: true 
                });

                // listen to authentication events
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) { 
                        await firebase.auth().signInAnonymously(); 
                    }
                    
                    // update user with active user
                    this.setState({
                        uid: user.uid,
                        messages: [],
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: 'https://placeimg.com/140/140/any',
                        },
                        loggedInText: `${this.props.route.params.name} has entered the chat`,
                    });

                    // reference to messages of active users
                    this.referenceMessagesUser = firebase
                        .firestore()
                        .collection('messages')
                        .where('uid', '==', this.state.uid);

                    // listen for collection changes
                    this.unsubscribe = this.referenceMessages
                        .orderBy('createdAt', 'desc')
                        .onSnapshot(this.onCollectionUpdate);
                    console.log('online');    
                });     
            } else { 
                this.setState({ 
                    isConnected: false, 
                }),

                this.getMessages();

                Alert.alert(
                    'You are offline'
                );
                console.log('offline');
            }
        });
    } 

    componentWillUnmount() {
        if (this.state.isConnected == false) {
        } else {
            // stop online authentication
            this.authUnsubscribe();
            // stop listening for changes
            this.unsubscribe();
        }
    } 

    render() {
        return (
            <View style={{flex: 1, 
                backgroundColor: this.props.route.params.backgroundColor }}
            >
               
                    <GiftedChat 
                        messages={this.state.messages}
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                        onSend={(messages) => this.onSend(messages)}
                        user={this.state.user}
                        renderBubble={this.renderBubble.bind(this)}
                        renderUsernameOnMessage
                        showUserAvatar
                        alwaysShowSend
                        scrollToBottom
                        inTyping={true}
                        renderActions={this.renderActions}
                        renderCustomView={this.renderCustomView}
                    />  
                    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }                
    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mapView: {
        width: 100, 
        height: 90, 
        margin: 3,
        borderRadius: 35,
    },
})

