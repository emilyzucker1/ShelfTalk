import React, {useState} from 'react';
import {Button,Text, Image, View, Platform, Alert, Pressable, StyleSheet} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export function formatStatus(status){
    
    const lower=status.toLowerCase();
    if (lower.includes("finished")){
        return {box: "finishedBox", style:"finishedBoxText"};
    }
    if(lower.includes("started")){
        return {box:"startedBox", style:"startedBoxText"}
    }
}
export default function JournalEntries({date, title, content, status, image, onEdit, book}) {
    //this is to change the format depending on status.
    const{box, style}=formatStatus(status);
    //this is to pick the image for the journal entry
    
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
                <Text style={{fontSize:11, fontWeith:'400', color:'#2f2f2f'}}>{book}</Text>
                <Text style={{fontSize:13, fontWeight:'500'}}>{title}</Text>
                <View style={styles[box]}>
                    <Text style={styles[style]}>{status}</Text>
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