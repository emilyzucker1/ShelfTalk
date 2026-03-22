import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import { auth } from './firebase';

SplashScreen.preventAutoHideAsync();

export default function LoadingScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !authInitialized) return; // ✅ wait for fonts and auth before animating

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(async () => {
        await SplashScreen.hideAsync();
        // Redirect based on authentication state
        if (user) {
          router.replace('/pages' as any);
        } else {
          router.replace('/newLogin' as any);
        }
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, authInitialized, user]); // ✅ re-run when fonts, auth, and user state are ready

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/shelftalkLogo.png')}
          style={{ width: 140, height: 140, borderRadius: 70 }}
        />
        <Text style={styles.title}>ShelfTalk</Text>
        <Text style={styles.subtitle}>
          Turn your reading moments into a cozy journal, where{'\n'}
          books, thoughts, and friends meet.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6f2f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center', paddingHorizontal: 40 },
  logoCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F4a896',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: { fontSize: 60 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#2f2f2f', marginBottom: 12 },
  subtitle: { fontSize: 15, fontFamily: 'Roboto_400Regular', color: '#C88B7D', textAlign: 'center', lineHeight: 22 },
});