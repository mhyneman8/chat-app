import React from 'react';
import { View, Text, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: '',
                username: '',
            },
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
    }

    componentDidMount() {
        const name = this.props.route.params.username;
        this.props.navigation.setOptions({ title: name });

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) { await firebase.auth().signInAnonymously(); }
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
            this.unsubscribe = this.referenceMessages
                .orderBy('createdAt', 'desc')
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            var data = doc.data();
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

    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessage();
            }
        );
    }

    componentWillUnmount() {
        // stop online authentication
        this.authUnsubscribe();
        this.unsubscribe();
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

    render() {
        console.ignoredYellowBox = [
            'Setting a timer'
          ]
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

                    />  
                    { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }                
                {/* </View> */}
            </View>
        );
    }
}

