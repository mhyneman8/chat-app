import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        const { name } = this.props.route.params;
        this.props.navigation.setOptions({ title: name });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
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
        return (
            <View style={{flex: 1, 
                backgroundCOlor: this.props.route.params.backgroundColor }}
            >
                <GiftedChat 
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />

                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null }
            </View>
        )
    }
}