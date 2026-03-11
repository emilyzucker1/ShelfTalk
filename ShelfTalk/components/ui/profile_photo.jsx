import React, {useState} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Button, Image, View, Platform, Alert, Pressable} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfilePhoto() {
    const [image, setImage] = useState(null);
    const pickImage = async () => {
        //this is to ask users for permission to access photos
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }
        //this is to open the image picker and allow users to select an image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled){
            setImage(result.assets[0].uri);
        }
    };
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius: 75 }} />
                ) : (
                    <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                        <AntDesign name="user" size={100} color="black" />
                    </View>
                )}
            </Pressable>
        </View>
    );
}