import React from 'react';
import { View, Text, Platform, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
            },
            isConnected: false,
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
        this.referenceMessageUser = null;
    }

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

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
        this.setState({
            messages,
        });
    };

    addMessage() {
        const message = this.state.messages[0];
        this.referenceMessages.add({
            uid: this.state.uid,
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user
        });
    }

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

    componentDidMount() {
        const name = this.props.route.params.username;
        this.props.navigation.setOptions({ title: name });

        //check if user is online
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({ 
                    isConnected: true 
                });

                this.getMessages();
                this.renderInputToolbar();

                // reference messages collection in firebase
                // this.referenceMessages = firebase.firestore().collection('messages');

                // listen to authentication events
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) { 
                        await firebase.auth().signInAnonymously(); 
                    }
                    
                    // update user with active user
                    this.setState({
                        uid: user.uid,
                        messages: [ ],
                        user: {
                            _id: user.uid,
                            name: name,
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
                {/* <View> */}
                    <GiftedChat 
                        messages={this.state.messages}
                        onSend={(messages) => this.onSend(messages)}
                        user={this.state.user}
                        renderBubble={this.renderBubble.bind(this)}
                        renderUsernameOnMessage
                        showUserAvatar
                        alwaysShowSend
                        scrollToBottom
                        inTyping={true}
                        renderInputToolbar={this.renderInputToolbar.bind(this)}
                    />  
                    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }                
                {/* </View> */}
            </View>
        );
    }
}

