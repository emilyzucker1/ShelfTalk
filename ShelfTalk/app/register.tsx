import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from "./firebase/authentication/emailauth/index";
import { onGoogleButtonPress } from './firebase/authentication/googleauth';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
     router.replace("/newLogin");
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
        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showBtn}>
            <Text style={styles.showBtnText}>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleRegister}>
          <Text style={styles.continueBtnText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* OAuth buttons */}
      <TouchableOpacity style={styles.oauthBtn} onPress={() => onGoogleButtonPress(router)}>
        <Text style={styles.oauthIcon}>G</Text>
        <Text style={styles.oauthText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthBtn}>
        <Text style={styles.oauthIcon}></Text>
        <Text style={styles.oauthText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* Login link */}
            <View style={styles.registerRow}>
              <Text style={styles.loginPrompt}>Already Registered? </Text>
              <TouchableOpacity onPress={() => router.push('/newLogin' as any)}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#90b8a8' },
  card: {
    backgroundColor: '#90b8a8',
    padding: 32, paddingTop: 30,
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
    marginBottom: 1
  },
  continueBtnText: { color: '#fff', fontWeight: '600', fontSize: 16},
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginPrompt: { fontSize: 14, color: '#2a2a2a' },
  loginLink: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', textDecorationLine: 'underline' },
  passwordWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 14,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  showBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  showBtnText: { fontSize: 13, color: '#555', fontWeight: '500' },
});