import AntDesign from '@expo/vector-icons/AntDesign';
import React, {useState} from "react";
import{Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform, Alert} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // you can refine this later
};
export default function AddJournal({visible, onClose, onSubmit}:Props){
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [entry, setEntry] = useState("");
    const [status, setStatus] = useState("Started");
    const [image, setImage] = useState<string | null>(null);
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
    const handleSubmit=()=>{
        onSubmit({
            title,
            date,
            entry,
            status,
            image,
        });
        //reset fields
        setTitle("");
        setDate("");
        setEntry("");
        setStatus("Started");
        setImage(null);

        onClose();
    };
    return (
        <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
            <View style={styles.popup}>
            <Text style={styles.header}>New Journal Entry</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#7A7A7A" 
                value={title}
                onChangeText={setTitle}
            />

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
                style={[styles.input, { height: 80 }]}
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
                    status === "Started" && styles.activeStatus,
                ]}
                onPress={() => setStatus("Started")}
                >
                <Text>Started</Text>
                </Pressable>

                <Pressable
                style={[
                    styles.statusButton,
                    status === "Finished" && styles.activeStatus,
                ]}
                onPress={() => setStatus("Finished")}
                >
                <Text>Finished</Text>
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
        popup: {
            width: 320,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
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









            
