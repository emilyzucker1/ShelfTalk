import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { createPost } from "./backend/create_document";
import { userID, username } from "./firebase/index";

//this adds the "Viewability" drop down menu to the testing page
const InlineDropdown = ({ data, onSelect }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleSelect = (item) => {
    setSelectedLabel(item.label);
    onSelect(item.value);
    setDropdownVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <ThemedText>{selectedLabel || "Viewability ↓"}</ThemedText>
      </TouchableOpacity>
      {isDropdownVisible && (
        <ThemedView style={styles.dropdownMenu}>
          {data.map((item) => (
            <TouchableOpacity key={item.label} onPress={() => handleSelect(item)} style={styles.dropdownItem}>
              <ThemedText>{item.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
    </>
  );
};

export default function LoginScreen() {
  const router = useRouter();
  const [book, setBook] = useState("");
  const [text, setText] = useState("");
  //for dropdown menu
  const [isPublic, setIsPublic] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const handlePress = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (isPublic === null) {
      setError("Please select public or private");
      return;
    }
    setError(""); //clear error if valid

    try {
      createPost(book, text, userID, username, isPublic);
    } catch (err) {
      console.error("error creating document", err);
    } finally {
      router.replace("/testing");
    }
  };

  const handleposts = () => {
    router.replace("/posts");
  };

  //drop down options - private vs public post
  const data = [
    {label: "Private - your eyes only", value: false},
    {label: "Public - share with the world!", value: true}
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">testing database for {username}</ThemedText>

      <TextInput
        placeholder="book"
        value={book}
        onChangeText={setBook}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="text"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}

      <ThemedView style={{ width: 250 }}>
        <InlineDropdown data={data} onSelect={setIsPublic} />
      </ThemedView>

      <Button title="Submit Doc" onPress={handlePress} />
      <Button title="Go to posts" onPress={handleposts} />
    </ThemedView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fdf3f3",
    borderRadius: 8,
    padding: 12,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});
