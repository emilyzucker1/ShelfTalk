import { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ProfilePhoto from "./profile_photo_edit";

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  username: string;
  description:string;
  photoUrl: string | null;
  onSave: (updated: { 
    username: string; 
    description: string;
    photoUrl: string | null;
    }) => void;

};

export default function EditProfileModal({
  visible,
  onClose,
  username,
  description,
  photoUrl,
  onSave,
}: EditProfileModalProps) {
  const [newUsername, setNewUsername] = useState(username);
  const [newDescription, setNewDescription] = useState(description);
  const [newPhotoUrl, setNewPhotoUrl] = useState(photoUrl);
  

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPhotoUrl(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>

          {/* 🔥 Your ProfilePhoto component */}
          <ProfilePhoto photoUrl={newPhotoUrl} onEdit={pickImage} />

          <TextInput
            value={newUsername}
            onChangeText={setNewUsername}
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="gray"
          />
          <TextInput
            value={newDescription}
            onChangeText={setNewDescription}
            style={styles.description_input}
            placeholder="Account description"
            placeholderTextColor="gray"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                onSave({
                username: newUsername,
                description: newDescription,
                photoUrl: newPhotoUrl,
                })

              }
            >
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 20,
  },
  description_input:{
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor:"#ccc",
    borderRadius: 8,
    marginTop:20,
    height:"auto",

  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  cancel: {
    fontSize: 16,
    color: "gray",
  },
  save: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "bold",
  },
});
