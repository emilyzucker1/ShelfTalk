import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { View } from "react-native";
import { auth } from '../firebase';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authInitialized && !user) {
      // User is not authenticated, redirect to login
      // debug malu: router.replace('/newLogin');
    }
  }, [authInitialized, user, router]);

  // Show loading or redirect if not authenticated
  if (!authInitialized) {
    return <View style={{ flex: 1, backgroundColor: '#E6F2F0' }} />;
  }
  // debug malu below
  // if (!user) {
  //   return null; // Will redirect in useEffect
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#000000",
        tabBarStyle: {
          backgroundColor: "#F4A896",
          height: 50,
          width: 330,
          borderRadius: 100,
          alignSelf: 'center',
          paddingBottom: 0,
          paddingTop: 0,
          bottom: 5,
          overflow: "visible",

        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 400,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <Feather name="home" size={20} color={color} />
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -21.5,
                    width: 60,
                    height: 4,
                    backgroundColor: "black",
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <FontAwesome name="search" size={18} color={color} />
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -21.5,
                    width: 60,
                    height: 4,
                    backgroundColor: "black",
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              <AntDesign name="user" size={18} color={color} />
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    bottom: -21.5,
                    width: 60,
                    height: 4,
                    backgroundColor: "black",
                    borderRadius: 2,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
