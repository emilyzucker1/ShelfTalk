import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { onGoogleButtonPress } from './firebase/authentication/googleauth';
import Svg, { Path } from 'react-native-svg';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { loginUserwithEmailandPassword } from "./firebase/authentication/emailauth";

function GoogleIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <Path fill="none" d="M0 0h48v48H0z"/>
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    loginUserwithEmailandPassword(email, password, router);
  };

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return <View />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.card}>
        <Image
          source={require('../assets/images/shelftalkLogo.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />
        <Text style={styles.heading}>Welcome back!</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
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

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.oauthBtn} onPress={() => onGoogleButtonPress(router)}>
        <GoogleIcon />
        <Text style={styles.oauthText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthBtn}>
        <AntDesign name="apple" size={20} color="#000" style={{ marginRight: 10 }} />
        <Text style={styles.oauthText}>Continue with Apple</Text>
      </TouchableOpacity>

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
  // ✅ fontWeight replaced with fontFamily for Roboto
  heading: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#1a1a1a', marginBottom: 4 },
  subheading: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#2a2a2a', marginBottom: 20 },
  input: {
    width: '100%', backgroundColor: '#f5f5f5',
    borderRadius: 12, padding: 14, fontSize: 15,
    marginBottom: 12, fontFamily: 'Roboto_400Regular',
  },
  passwordWrapper: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 12, marginBottom: 8, paddingRight: 14,
  },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, fontFamily: 'Roboto_400Regular' },
  showBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  showBtnText: { fontSize: 13, fontFamily: 'Roboto_500Medium', color: '#555' },
  forgotWrapper: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotText: { fontSize: 13, fontFamily: 'Roboto_400Regular', color: '#1a1a1a', textDecorationLine: 'underline' },
  continueBtn: {
    width: '100%', backgroundColor: '#2f2f2f',
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 16 },
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
  dividerText: { marginHorizontal: 12, fontFamily: 'Roboto_400Regular', color: '#888', fontSize: 13 },
  oauthBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e6f2f0', borderRadius: 12, padding: 14,
    marginHorizontal: 24, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  oauthIcon: { fontSize: 18, marginRight: 10, fontFamily: 'Inter_600SemiBold' },
  oauthText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  registerPrompt: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#2a2a2a' },
  registerLink: { fontSize: 14, fontFamily: 'Roboto_700Bold', color: '#1a1a1a', textDecorationLine: 'underline' },
});