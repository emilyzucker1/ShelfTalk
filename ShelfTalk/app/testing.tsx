import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { createPost } from "./backend/create_document";
import { userID } from "./firebase/index";

export default function LoginScreen() {
  const router = useRouter();
  const [book, setBook] = useState("");
  const [text, setText] = useState("");

  const handlePress = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      createPost(book, text, userID);
    } catch (err) {
      console.error("error creating document", err);
    } finally {
      router.replace("/testing");
    }
  };

  const handleposts = () => {
    router.replace("/posts");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Testing Database</ThemedText>

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

      <Button title="Submit Doc" onPress={handlePress} />
      <Button title="Go to posts" onPress={handleposts} />
    </ThemedView>
  );
}

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
});
