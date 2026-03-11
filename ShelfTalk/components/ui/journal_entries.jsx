import React, {useState} from 'react';
import {Button,Text, Image, View, Platform, Alert, Pressable} from 'react-native';

export default function JournalEntries({date, title, content, status}) {
const [image, setImage] = useState(null);
    //this is to pick the image for the journal entry
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
        <View style={{flexDirection:'row', alignItems:'center', gap:10, padding:10, backgroundColor:'transparent', borderRadius:10, marginBottom:10}}>
        <Pressable onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 77, height: 100, borderRadius: 0 }} />
                ) : (
                    <View style={{ width: 77, height: 100, borderRadius: 0, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                    </View>
                )}
            </Pressable>
            <View style={{flex:1, gap:5}}>
                <Text style={{fontSize:10, fontWeight:'400', color:'#2F2F2F'}}>{date}</Text>
                <Text style={{fontSize:13, fontWeight:'500'}}>{title}</Text>
                <Text style={{fontSize:12, fontWeight:'400', color:'#748B97'}}>{status}</Text>
            </View>
        </View>
    );
}