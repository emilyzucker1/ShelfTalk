import React, { useState } from 'react';
import {View, Text}from 'react-native';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    //checks with firebase to ensure the email + password belongs to a valid user
    //if not, then an error is thrown and the user is alerted that the login failed
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase user:", cred.user.uid);
      router.replace('/(tabs)/explore');
    } catch (error) {
      console.log(error);
      Alert.alert("Login failed");
    }
    // // Simple validation
    // if (email === 'test@example.com' && password === 'password') {
    //   // Fake login success
    //   router.replace('/(tabs)/explore');
    // } else {
    //   Alert.alert('Error', 'Invalid credentials');
    // }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fdf3f3',
    borderRadius: 8,
    padding: 12,
  },
});