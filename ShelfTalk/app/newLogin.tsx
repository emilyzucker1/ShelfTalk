import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { onGoogleButtonPress } from './firebase/authentication/googleauth/index';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: wire up your auth logic here
    console.log('Login:', { username, password });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />  {/* ← add this */}
      {/* Top sage card */}
      <View style={styles.card}>

        <Image
          source={require('../assets/images/shelftalkLogo.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />

        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
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

        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} onPress={handleLogin}>
          <Text style={styles.continueBtnText}>Sign In</Text>
        </TouchableOpacity>
      </View>

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

      {/* Register link */}
      <View style={styles.registerRow}>
        <Text style={styles.registerPrompt}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register' as any)}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>

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
  heading: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  subheading: { fontSize: 14, color: '#2a2a2a', marginBottom: 20 },
  input: {
    width: '100%', backgroundColor: '#f5f5f5',
    borderRadius: 12, padding: 14, fontSize: 15,
    marginBottom: 12,
  },
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
  forgotWrapper: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotText: { fontSize: 13, color: '#1a1a1a', textDecorationLine: 'underline' },
  continueBtn: {
    width: '100%', backgroundColor: '#1a1a1a',
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
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
  registerPrompt: { fontSize: 14, color: '#2a2a2a' },
  registerLink: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', textDecorationLine: 'underline' },
});