import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { onGoogleButtonPress } from './firebase/authentication/googleauth/index.js';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Top sage card */}
      <View style={styles.card}>

        <Image
            source={require('../assets/images/shelftalkLogo.png')}
            style={{ width: 120, height: 120, marginBottom: 20 }}
        />
       
        <Text style={styles.heading}>Create an account</Text>
        <Text style={styles.subheading}>Enter your email to sign up</Text>

        <TextInput
          style={styles.input}
          placeholder="email@domain.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueBtnText}>Continue</Text>
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
});