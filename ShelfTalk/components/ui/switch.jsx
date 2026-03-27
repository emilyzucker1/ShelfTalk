import React, {useState} from 'react';
import { Platform } from "react-native";
import {View, Pressable, StyleSheet, Text} from 'react-native';

export default function CustomSwitch({ selected, onSelectChange }) {
    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.button, selected === "journal" && styles.activeButton]}
                onPress={() => onSelectChange("journal")}
            >
                <Text style={[styles.text, selected === "journal" && styles.activeText

                ]}
                >
                    Journal Entries 
                </Text>
            </Pressable>
            <Pressable
                style={[styles.button, selected === "shelves" && styles.activeButton

                ]}
                onPress={() => onSelectChange("shelves")}
            >
                <Text style={[styles.text, selected === "shelves" && styles.activeText

                ]}
                >
                    Shelves/Collections 
                    </Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F4A896",
    borderRadius: 100,
    padding: 6,
    height: 50,
    alignItems: "center",
    justifyContent: "center",

    // ⭐ Make it look good on web
    width: Platform.OS === "web" ? 350 : "90%",
    alignSelf: "center",
  },

  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 43,
  },

  activeButton: {
    backgroundColor: "#FFE5DE",
  },

  text: {
    color: "#2f2f2f",
    fontWeight: "400",
    fontSize: Platform.OS === "web" ? 14 : 16, // tighter on web
  },

  activeText: {
    color: "#2f2f2f",
    fontWeight: "600",
  },
});