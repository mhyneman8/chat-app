import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
// import MapView from 'react-native-maps';

import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
   constructor() {
       super();
   }

   // User presses action button
    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        // positions button
        const cancelButtonIndex = options.length -1;

        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickImage();
                    case 1:
                        console.log('user wants to take a photo');
                        return this.takePhoto();
                    case 2:
                        console.log('user wants to get their location');
                        return this.getLocation();
                    default:
                }
            }
        )
    }

    // lets user pick image from library to send
    pickImage = async () => {
        // asks permission for media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        try {
            if(status === 'granted') {
                // launches local picture library
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));

                // uploads image to database and sends image in chat bubble
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch(error) {
            console.log(error.message);
        }
    };

    // lets user take a photo and send
    takePhoto = async () =>{
            // asks permission for camera and media library
            const { status } = await Camera.requestCameraPermissionsAsync();

        try {
            if(status === 'granted') {
                // launches camera
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));

                // uploads image to database and sends in chat bubble
                if(!ImagePicker.getPendingResultAsync.cancelled) {
                    const imageUrl = await this.uploadImage(result.uri);
                    this.props.onSend({ image: imageUrl, text: '' });
                    // this.setState({
                    //     image: result
                    // });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };
        
    // upload image as blob to firebase
    uploadImage = async (uri) => {
            // convert image to blob
            const blob = await new Promise((resolve, reject) => {
                //creates new XMLHttp request
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (error) {
                    console.log(error);
                    reject(new TypeError('Network Request Failed'));
                };
                // opens connection to receive image data and responds as blob type
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            // creates unique file names for storage
            const fileNameBefore = uri.split('/');
            const fileName = fileNameBefore[fileNameBefore.length -1];

            // references remote database storage (firestore)
            const ref = firebase.storage().ref().child(`${fileName}`);
            const snapshot = await ref.put(blob);
            blob.close();

            // return image's unique URL from remote database
            return await snapshot.ref.getDownloadURL();
    };

    // gets users location to send
    getLocation = async () => {
        // permission for location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        try {
            if(status === 'granted') {
                // get users location
                let result = await Location.getCurrentPositionAsync({
                    enableHighAccuracy: true
                }).catch((error) => {
                    console.log(error.message);
                });

                if (result) {
                    // sends users location
                    this.props.onSend({
                        location: {
                            latitude: result.coords.latitude,
                            longitude: result.coords.longitude
                        },
                    });
                    this.setState({
                        location: result
                    }); 
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    render () {
        return (
            <TouchableOpacity 
                style={[styles.container]}
                accessibilityLabel='Action button'
                accessibilityHint='Select an image, take a picture, or send location'
                onPress={this.onActionPress}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]} >
                        +
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func
};