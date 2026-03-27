import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type ProfilePhotoProps = {
  photoUrl: string | null;
  onEdit: () => void;
};

export default function ProfilePhoto({ photoUrl, onEdit }: ProfilePhotoProps) {
  return (
    <View style={styles.container}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.image} />
      ) : (
        <View style={styles.defaultIconContainer}>
          <AntDesign name="user" size={80} color="black" />
        </View>
      )}

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <View style={styles.editCircle}>
          <Ionicons name="pencil" size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  defaultIconContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});