import React from 'react';
import { View, Text, Alert, ImageBackground, Platform, 
    StyleSheet, TextInput, TouchableOpacity, Pressable, 
    KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-elements';

// background image
const image = require('../img/Background.png');

export default class start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            backgroundColor: '',
        };
    }

    // check for username
    onGoToChat = (username, backgroundColor) => {
        if(username == '') {
            return Alert.alert('Please enter username.');
        }
        this.props.navigation.navigate('Chat', {
            username: `${username}`,
            backgroundColor: `${backgroundColor}`,
        });
    }

    componentDidMount() {
        let name = this.props.route.params;

        this.props.navigation.setOptions({ title: name });
    }

    render () {
        // const setColor = this.state.backgroundColor;

        return(
            <View style={styles.container}>
                <ImageBackground
                    source={image}
                    resizeMode="cover"
                    style={{width: '100%', height: '100%', resizeMode: 'cover '}}
                >
                    
                    {/* Title */}
                    <Text style={styles.title}>
                        Chat-Me
                    </Text>

                    <View style={styles.box1}>
                        <View style={styles.nameSection} >
                            <Icon 
                                style={styles.icon}
                                name='person-outline'
                                color='#757083'
                                size={25}
                            />

                            {/* username */}
                            <TextInput
                                style={styles.input}
                                onChangeText={(username) => this.setState({ username })}
                                value={this.state.username}
                                placeholder='Type Your Name' 
                            />
                        </View>{/* end of nameSection */} 

                        {/* choose background color */}
                        <View style={styles.backgroundChoice}>
                            <Text style={styles.backgroundColor}>
                                Choose Background Color:
                            </Text>

                            {/* background color options */}
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color1, this.state.backgroundColor === '#090c08' ? styles.border : null ]}
                                    onPress={() => this.setState({ backgroundColor: '#090c08'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color2, this.state.backgroundColor === '#474056' ? styles.border : null ]}
                                    onPress={() => this.setState({ backgroundColor: '#474056'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color3, this.state.backgroundColor === '#8a95a5' ? styles.border : null ]}
                                    onPress={() => this.setState({ backgroundColor: '#8a95a5'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color4, this.state.backgroundColor === '#b9c6ae' ? styles.border : null ]}
                                    onPress={() => this.setState({ backgroundColor: '#b9c6ae'})}
                                />
                            </View> 
                             {/* end of backgroundColor options */}
                        </View> 
                        {/* end of choose backgroundColor choice */}

                        {/* pressable is a button you can add css */}
                        <Pressable
                            accessible={true}
                            accessibilityLabel='Start Chatting'
                            accessibilityHint='Takes you to the chat screen'
                            style={styles.chatButton}
                            onPress={() => this.onGoToChat(this.state.username, this.state.backgroundColor)}
                        >
                            <Text style={styles.chatText}>
                                Start Chatting
                            </Text>
                        </Pressable>

                        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={100} /> : null } 
                    
                    </View> 
                    {/* end of box1 */}
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'teal'
    },
    box1: {
        width: '88%',
        height: '44%',
        minHeight: 200,
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 25,
    },
    title: {
        flex: 0.95,
        justifyContent: 'center',
        fontSize: 45,
        top: 95,
        left: 120,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    backgroundIcon: {
        borderRadius: 25,
        width: 50, 
        height: 50, 
        margin: 10
    },
    backgroundChoice: {
        marginTop: 20,
        marginBottom: 15,
        marginLeft: -30
    },
    backgroundColor: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 1
    },
    color1: {
        backgroundColor: '#090c08'
    },
    color2: {
        backgroundColor: '#474056'
    },
    color3: {
        backgroundColor: '#8a95a5'
    },
    color4: {
        backgroundColor: '#b9c6ae'
    },
    border: {
        borderStyle: 'dashed',
        borderWidth: 3,
        borderColor: '#957083',
    },
    selectedItemStyle: {
        borderColor: 'yellow',
        borderWidth: 3
    },
    chatButton: {
        fontSize: 16,
        fontWeight: '600',
        width: '88%',
        height: 55,
        color: '#FFF',
        backgroundColor: '#957083',
        justifyContent: 'center',
        marginTop: 20
    },
    chatText: {
        fontSize: 16, 
        fontWeight: '300', 
        color: '#fff', 
        textAlign: 'center'
    },
    nameSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: 'gray', 
        borderWidth: 1,
        height: 55,
        padding: 10,
        margin: 20
    },
    input: {
        flex: 1,
        top: 0,
        color: '#757083',
        paddingLeft: 10,
        fontSize: 16,
        fontWeight: '300',
        opacity: 0.5
    },
    icon: {
        opacity: 0.2
    }
    
})