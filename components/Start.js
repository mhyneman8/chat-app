import React from 'react';
import { View, Text, Alert, ImageBackground, Platform } from 'react-native';

// background image
const image = require('../img/Background.png');

export default class start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            backgroundColor: '',
        };
    }

    // check for username
    onGoToChat = (username, backgroundColor) => {
        if(name === '') {
            return Alert.alert('Please enter your name.');
        }
        this.props.navigation.navigate('Chat', {
            name: this.props.route.params.name,
            backgroundColor: `${backgroundColor}`,
        });
    }

    render () {
        let name = this.props.route.params.name;

        this.props.navigation.setOptions({ title: name });

        return(
            <View style={styles.container}>
                <ImageBackground
                    source={image}
                    resizeMode="cover"
                    style={{width: '100%', height: '100%', resizeMode: 'cover '}}
                >
                    <Text style={styles.title}>
                        Chat-Me
                    </Text>
                    <View style={styles.box1}>
                        <View style={styles.nameSection}>
                            <Icon 
                                style={styles.icon}
                                name='person-outline'
                                color='#757083'
                                size={25}
                            />
                            {/* username */}
                            <TextInput
                                style={styles.input}
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name}
                                placeholder='Type Your Name'>
                            </TextInput>
                        </View>
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
                                    onPress={() => this.setState({backgroundColor: '#090c08'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color1, this.state.backgroundColor === '#474056' ? styles.border : null ]}
                                    onPress={() => this.setState({backgroundColor: '#474056'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color1, this.state.backgroundColor === '#8a95a5' ? styles.border : null ]}
                                    onPress={() => this.setState({backgroundColor: '#8a95a5'})}
                                />

                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='More options'
                                    accissibilityHint='Lets you choose to send an image or your geolocation'
                                    accessibilityRole='button'
                                    style={[styles.backgroundIcon, styles.color1, this.state.backgroundColor === '#b9c6ae' ? styles.border : null ]}
                                    onPress={() => this.setState({backgroundColor: '#b9c6ae'})}
                                />
                            </View> {/* end of backgroundColor options */}
                        </View> {/* end of choose backgroundColor choice */}

                        {/* pressable is a button you can add css */}
                        <Pressable
                            style={styles.chatButton}
                            onPress={() => this.onGoToChat(this.state.name, this.state.backgroundColor)}
                        >
                            <Text>
                                Start Chatting
                            </Text>
                        </Pressable>

                        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={100} /> : null } 
                    
                    </View> {/* end of box1 */}
                </ImageBackground>
            </View>
        )
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