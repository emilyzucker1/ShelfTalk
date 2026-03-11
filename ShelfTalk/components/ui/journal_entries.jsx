import React, {useState} from 'react';
import {Button,Text, Image, View, Platform, Alert, Pressable, StyleSheet} from 'react-native';

export function formatStatus(status){
    
    const lower=status.toLowerCase();
    if (lower.includes("finished")){
        return {box: "finishedBox", style:"finishedBoxText"};
    }
    if(lower.includes("started")){
        return {box:"startedBox", style:"startedBoxText"}
    }
}
export default function JournalEntries({date, title, content, status}) {
    //this is to change the format depending on status.
    const{box, style}=formatStatus(status);
    //this is to pick the image for the journal entry
    const[image,setImage]=useState(null);
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
    const styles = StyleSheet.create({
        finishedBox: {
        backgroundColor: "#91DBBD",
        borderWidth: 2,
        borderColor: "#91DBBD",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 7.4,
        width:90,
        alignItems:"center",
        
    },
    finishedBoxText: {
        color: "#356E35",
        fontSize: 12,
        fontWeight: "500",
    },
    startedBox: {
        backgroundColor: "#748B97",
        borderWidth: 2,
        borderColor: "#748B97",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 7.4,
        width:90,
        alignItems:"center",
        
        
    },
    startedBoxText: {
        color: "#E6F2F0",
        fontSize: 8,
        fontWeight: "500",
    },
    });
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
                <View style={styles[box]}>
                    <Text style={styles[style]}>{status}</Text>
                </View>
                
            </View>
        </View>
    );
    

}