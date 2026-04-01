import React, {useState} from 'react';
import {Button,Text, Image, View, Platform, Alert, Pressable, StyleSheet} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function JournalEntries({date, title, book = "", content, visibility, image, onEdit}) {
    //this is to pick the image for the journal entry
    
    const styles = StyleSheet.create({
        visibilityBox: {
        backgroundColor: visibility === "Public" ? "#91DBBD" : "#748B97",
        borderWidth: 2,
        borderColor: visibility === "Public" ? "#91DBBD" : "#748B97",
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 7.4,
        width:90,
        alignItems:"center",
        
    },
    visibilityBoxText: {
        color: visibility === "Public" ? "#356E35" : "#E6F2F0",
        fontSize: 12,
        fontWeight: "500",
    },
    });
    return (
        <View>
        <View style={{flexDirection:'row', alignItems:'center', gap:10, padding:10, backgroundColor:'transparent', borderRadius:10, marginBottom:10}}>
                {image ? (
                    <Image source={{ uri: image }} style={{ width: 77, height: 100, borderRadius: 0 }} />
                ) : (
                <View style={{ width: 77, height: 100, borderRadius: 0, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                </View>
                )}
            
            <View style={{flex:1, gap:5}}>
                <Text style={{fontSize:10, fontWeight:'400', color:'#2F2F2F'}}>{date}</Text>
                <Text style={{fontSize:11, fontWeight:'400', color:'#2f2f2f'}}>{book}</Text>
                <Text style={{fontSize:13, fontWeight:'500'}}>{title}</Text>
                <View style={styles.visibilityBox}>
                    <Text style={styles.visibilityBoxText}>{visibility}</Text>
                </View>
                
            </View>
            <Pressable onPress={onEdit}>
                <Feather name="edit" size={24} color="#605F5F" />
            </Pressable>
            
        </View>
        <View
            style={{
                height: 1,
                backgroundColor: "#605F5F",
                width: "80%",
                alignSelf:"center",
                marginTop: 5,
                marginBottom: 10,
            }}
            />

        </View>
        
    );
    

}