import AntDesign from '@expo/vector-icons/AntDesign';
import { GoogleGenAI } from "@google/genai";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React, {useState} from "react";
import{Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform, Alert} from "react-native";
import {useEffect} from "react";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // you can refine this later
  initialData?:any | null;
};
export default function AddJournal({visible, onClose, onSubmit, initialData}:Props){
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [entry, setEntry] = useState("");
    const [book, setBook]=useState("");
    const [status, setStatus] = useState("Started");
    const [isPublic, setIsPublic] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const [loadingPrompt, setLoadingPrompt]=useState(false);
    useEffect(() => {
        if (initialData) {
            setTitle(initialData?.question ?? initialData?.title ?? "");
            setDate(initialData.date);
            setEntry(initialData.entry);
            setBook(initialData?.book ?? initialData?.title ?? "");
            setStatus(initialData.status);
            setIsPublic(Boolean(initialData.isPublic));
            setImage(initialData.image);
        } else {
            // Reset when adding a new entry
            setTitle("");
            setDate("");
            setEntry("");
            setBook("");
            setStatus("Started");
            setIsPublic(false);
            setImage(null);
        }
        }, [initialData, visible]);
    const pickImage=async()=>{
        if (Platform.OS!="web"){
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status!="granted"){
                Alert.alert("Permission Denied", "We need access to your photos");
                return;
            }
        }
        let result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

    };
    const handleGeneratePrompt = async () => {
        if (!book.trim()) return;
        try {
            
            setLoadingPrompt(true);
            const response = await fetch(`${API_URL}/generatePrompt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book }),
            });

            const data = await response.json();

            if (data.prompt) {
            setTitle(data.prompt);
            }

        } catch (err) {
            console.error("Error generating prompt:", err);
        }
        finally{
            setLoadingPrompt(false);
        }
        };


    const handleSubmit=()=>{
        onSubmit({
            title,
            question: title,
            date,
            entry,
            book: book || title,
            status,
            isPublic,
            image,
        });
        //reset fields
        if(!initialData){
            setTitle("");
            setDate("");
            setEntry("");
            setBook("");
            setStatus("Started");
            setIsPublic(false);
            setImage(null);
        }
        

        onClose();
    };
    return (
        <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback
        onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
        >        
            <View style={styles.overlay}>
            <View style={styles.popup}>
            <Text style={styles.header}>New Journal Entry</Text>
            <TextInput
                style={styles.input}
                placeholder="Book Title"
                placeholderTextColor="#7A7A7A" 
                value={book}
                onChangeText={setBook}
            />
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                <TextInput
                    style={[styles.input, {height:"auto"}]}
                    placeholder="Journaling Prompt"
                    placeholderTextColor="#7A7A7A" 
                    value={title}
                    onChangeText={setTitle}
                />
                </View>
                <Pressable style={styles.promptButton} onPress={handleGeneratePrompt} disabled={loadingPrompt}>
                    {loadingPrompt ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <FontAwesome5 name="dice" size={20} color="black" />
                    )}
                    </Pressable>



            </View>
            <TextInput
                style={styles.input}
                placeholder="Date (e.g. 3/11/2026)"
                placeholderTextColor="#7A7A7A" 
                value={date}
                onChangeText={setDate}
            />
           

            <Pressable style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                <Text style={{ color: "#666" }}>Pick an Image</Text>
                )}
            </Pressable>
            <TextInput
                style={[styles.input,styles.entryBox]}
                placeholder="Write your entry..."
                placeholderTextColor="#7A7A7A" 
                value={entry}
                onChangeText={setEntry}
                multiline
            />

            <View style={styles.statusRow}>
                <Pressable
                style={[
                    styles.statusButton,
                    !isPublic && styles.activeStatus,
                ]}
                onPress={() => setIsPublic(false)}
                >
                <Text>Private</Text>
                </Pressable>

                <Pressable
                style={[
                    styles.statusButton,
                    isPublic && styles.activeStatus,
                ]}
                onPress={() => setIsPublic(true)}
                >
                <Text>Public</Text>
                </Pressable>
            </View>
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Save Entry</Text>
            </Pressable>

            <Pressable onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            </View>
        </View>
        </TouchableWithoutFeedback>
        </Modal>
    );
    }
    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        promptButton: {
            width: 45,
            height: 45,
            borderRadius: 8,
            backgroundColor: "#EDEDED",
            justifyContent: "center",
            alignItems: "center",
            },

        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8, // optional, RN 0.71+
            },

        popup: {
            width: Platform.OS === "web" ? 500 : "85%",
            height: Platform.OS === "web" ? "auto" : "70%",
            maxHeight: "90%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
        },

        entryBox: {
            flex: 1,
            minHeight: 120,
            textAlignVertical: "top",
            paddingTop: 10,
        },

        header: {
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
        },
        input: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
        },
        imagePicker: {
            height: 100,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
        },
        imagePreview: {
            width: "100%",
            height: "100%",
            borderRadius: 8,
        },
        statusRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
        },
        statusButton: {
            padding: 10,
            borderWidth: 1,
            borderColor: "#aaa",
            borderRadius: 8,
            width: "48%",
            alignItems: "center",
        },
        activeStatus: {
            backgroundColor: "#d0f0d0",
            borderColor: "#6bbf6b",
        },
        submitButton: {
            backgroundColor: "#F4A896",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 8,
        },
        submitText: {
            color: "white",
            fontWeight: "600",
        },
        cancelText: {
            textAlign: "center",
            color: "black",
        },
        });









            
