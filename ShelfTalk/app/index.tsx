import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function LoadingScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in the logo
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
        router.replace('/login' as any);
    });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

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
    backgroundColor: '#E6f2f0', // light sage from your design
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center', paddingHorizontal: 40 },
  logoCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F4a896', // peach circle
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: { fontSize: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#2f2f2f', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#C88B7D', textAlign: 'center', lineHeight: 22 },
});