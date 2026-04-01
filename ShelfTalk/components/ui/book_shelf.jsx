import React, {useState} from 'react';
import {Button,Text, Image, View, Platform, Alert, Pressable, StyleSheet} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
export function formatStatus(status) {
  const lower = status.toLowerCase();

  if (lower.includes("currently reading")) {
    return { box: "startedBox", style: "startedBoxText" };
  }

  if (lower.includes("finished")) {
    return { box: "finishedBox", style: "finishedBoxText" };
  }

  if (lower.includes("want to read")) {
    return { box: "wantBox", style: "wantBoxText" };
  }

  return { box: "defaultBox", style: "defaultBoxText" };
}

export default function BookShelf({ title, cover_image, status }) {
  const { box, style } = formatStatus(status);

  const styles = StyleSheet.create({
    finishedBox: {
      backgroundColor: "#91DBBD",
      borderWidth: 2,
      borderColor: "#91DBBD",
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 7.4,
      width: 90,
      alignItems: "center",
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
      width: 90,
      alignItems: "center",
    },
    startedBoxText: {
      color: "#E6F2F0",
      fontSize: 8,
      fontWeight: "500",
    },

    // Add these so your fallback works
    wantBox: {
      backgroundColor: "#E5D1FA",
      borderWidth: 2,
      borderColor: "#E5D1FA",
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 7.4,
      width: 90,
      alignItems: "center",
    },
    wantBoxText: {
      color: "#5A3E7A",
      fontSize: 10,
      fontWeight: "500",
    },
    defaultBox: {
      backgroundColor: "#ccc",
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 7.4,
      width: 90,
      alignItems: "center",
    },
    defaultBoxText: {
      color: "#333",
      fontSize: 10,
    },
  });

  return (
    <View>
      {cover_image ? (
        <Image
          source={{ uri: cover_image }}
          style={{ width: 77, height: 100, borderRadius: 0 }}
        />
      ) : (
        <View
          style={{
            width: 77,
            height: 100,
            borderRadius: 0,
            backgroundColor: "#ccc",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}

      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontSize: 10, fontWeight: "400", color: "#2F2F2F" }}>
          {title}
        </Text>

        <View style={styles[box]}>
          <Text style={styles[style]}>{status}</Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: "#605F5F",
          width: "80%",
          alignSelf: "center",
          marginTop: 5,
          marginBottom: 10,
        }}
      />
    </View>
  );
}