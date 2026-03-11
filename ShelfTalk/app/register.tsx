<<<<<<< HEAD:ShelfTalk/app/login.tsx
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { onGoogleButtonPress } from './firebase/authentication/googleauth/index.js';
=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import React, {useState} from "react";
import {useRouter} from "expo-router";
import { registerUser } from "./firebase/authentication/emailauth/index";
import { auth } from "./firebase";
>>>>>>> 1764b4526e60ca8a71c1e5f9baaf803e3aee1478:ShelfTalk/app/register.tsx

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

    const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const userCredential = await registerUser(email, password, username, router);
      const firebaseUser = userCredential?.user;
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      router.replace("./pages/index");
    }
  };


   const handlegotologin = () => {
     router.replace("/login");
   };


  return (
    <View style={styles.container}>
      {/* Top sage card */}
      <View style={styles.card}>

        <Image
            source={require('../assets/images/shelftalkLogo.png')}
            style={{ width: 120, height: 120, marginBottom: 20 }}
        />
       
        <Text style={styles.heading}>Create an account</Text>
        <Text style={styles.subheading}>Enter your email and a password to sign up</Text>

        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.continueBtn} onPress={handleRegister}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navtoLogin} onPress={handlegotologin}>
          <Text style={styles.navtoLoginText}>Sign in here!</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* OAuth buttons */}
      <TouchableOpacity style={styles.oauthBtn} onPress={() => onGoogleButtonPress()}>
        <Text style={styles.oauthIcon}>G</Text>
        <Text style={styles.oauthText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthBtn}>
        <Text style={styles.oauthIcon}></Text>
        <Text style={styles.oauthText}>Continue with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#90b8a8' },
  card: {
    backgroundColor: '#90b8a8',
    padding: 32, paddingTop: 60,
    alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },   // ← missing
  subheading: { fontSize: 14, color: '#2a2a2a', marginBottom: 20 },                  // ← missing
  input: {                                                                             // ← missing
    width: '100%', backgroundColor: '#f5f5f5',
    borderRadius: 12, padding: 14, fontSize: 15,
    marginBottom: 12,
  },
  continueBtn: {
    width: '100%', backgroundColor: '#1a1a1a',
    borderRadius: 12, padding: 16, alignItems: 'center',
    marginBottom: 10
  },
  navtoLogin: {
    width: '100%', backgroundColor: '#1a1a1a',
    borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 10
  },
  continueBtnText: { color: '#fff', fontWeight: '600', fontSize: 16},
  navtoLoginText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
  dividerText: { marginHorizontal: 12, color: '#888', fontSize: 13 },
  oauthBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginHorizontal: 24, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  oauthIcon: { fontSize: 18, marginRight: 10, fontWeight: '700' },
  oauthText: { fontSize: 15, fontWeight: '500' },
});