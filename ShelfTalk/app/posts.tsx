import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "./firebase/index.js";
import { useRouter } from "expo-router";
import { deletePost } from "./backend/delete_document.js";
import { getUserPosts } from "./backend/get_documents.js";

export default function PostsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const mountedRef = useRef(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const posts = await getUserPosts(auth?.currentUser?.uid);
      setPosts(posts);

    } catch (e) {
      console.log("Error fetching posts:", e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchPosts();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handlereturn = () => {
    router.replace("/testing");
  };

  const confirmDelete = (postId: string) => {
    console.log("confirmDelete called for", postId);
    // show inline confirmation UI instead of system alert
    setPendingDeleteId(postId);
  };

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const performDelete = async (postId: string) => {
    console.log("performDelete called for", postId);
    try {
      const res = await deletePost(postId);
      console.log("performDelete result", res);
      if (res?.ok) {
        setPendingDeleteId(null);
        fetchPosts();
      } else {
        Alert.alert("Delete failed", res?.error || "Unknown error");
      }
    } catch (err) {
      console.log("performDelete error", err);
      Alert.alert("Delete failed", err?.message || String(err));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="Return to Testing" onPress={handlereturn} />
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button title="Return to Testing" onPress={handlereturn} />
        </View>
        <View style={styles.center}>
          <Text>No posts found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Return to Testing" onPress={handlereturn} />
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
        const renderValue = (val: any) => {
          if (val == null) return String(val);
          if (typeof val === "object") {
            // Firestore Timestamp
            if (typeof val.toDate === "function") {
              return val.toDate().toLocaleString();
            }
            try {
              return JSON.stringify(val);
            } catch {
              return String(val);
            }
          }
          return String(val);
        };

        // Define preferred key order, then append remaining keys sorted alphabetically
        const preferredOrder = ["title", "body", "authorId", "createdAt", "updatedAt"];
        const keys = Object.keys(item).filter((k) => k !== "id");
        const orderedKeys = [
          ...preferredOrder.filter((k) => keys.includes(k)),
          ...keys.filter((k) => !preferredOrder.includes(k)).sort(),
        ];

        return (
          <View style={styles.card}>
            {orderedKeys.map((key) => (
              <View key={key} style={{ marginBottom: 6 }}>
                <Text style={styles.fieldKey}>{key}</Text>
                <Text style={styles.fieldValue}>{renderValue((item as any)[key])}</Text>
              </View>
            ))}
            <View style={styles.itemActionsRow}>
              {auth?.currentUser?.uid === (item as any).authorId ? (
                <View style={styles.itemActions}>
                  {pendingDeleteId === item.id ? (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Button title="Cancel" onPress={() => setPendingDeleteId(null)} />
                      <Button title="Confirm Delete" color="#d9534f" onPress={() => performDelete(item.id)} />
                    </View>
                  ) : (
                    <Button title="Delete" color="#d9534f" onPress={() => confirmDelete(item.id)} />
                  )}
                </View>
              ) : null}
            </View>
          </View>
        );
      }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16 },
  card: { padding: 12, borderRadius: 8, backgroundColor: "#fff", marginBottom: 12 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  body: { fontSize: 14, color: "#333" },
  meta: { marginTop: 8, fontSize: 12, color: "#666" },
  fieldKey: { fontSize: 12, color: "#666", fontWeight: "600" },
  fieldValue: { fontSize: 14, color: "#222" },
  container: { flex: 1 },
  header: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  itemActions: { marginTop: 8, alignItems: "flex-end" },
  itemActionsRow: { flexDirection: "row", justifyContent: "space-between" },
  debugText: { fontSize: 12, color: "#999" },
});
