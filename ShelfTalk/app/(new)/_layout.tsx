import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import {Image, View} from "react-native";
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor:"#000000",
        tabBarStyle:{
          backgroundColor:"#F4A896",
          height:50,
          width:330,
          borderRadius:100,
          alignSelf:'center',
          paddingBottom: 0,
          paddingTop: 0, 
          bottom: 5,
          overflow:"visible",
          
        },
        tabBarLabelStyle:{
          fontSize: 10,
          fontWeight:400,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused}) => (
            <View style={{alignItems:"center"}}>
              <Feather name="home" size={20} color={color} />
              {focused &&(
                <View
                  style={{
                    position:"absolute",
                    bottom:-21.5,
                    width:60,
                    height:4,
                    backgroundColor:"black",
                    borderRadius:2,
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
          tabBarIcon: ({ color, focused}) => (
            <View style={{alignItems:"center"}}>
              <FontAwesome name="search" size={18} color={color} />
              {focused &&(
                <View
                  style={{
                    position:"absolute",
                    bottom:-21.5,
                    width:60,
                    height:4,
                    backgroundColor:"black",
                    borderRadius:2,
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
            title:'Profile',
            tabBarIcon: ({ color, focused}) => (
            <View style={{alignItems:"center"}}>
              <AntDesign name="user" size={18} color={color} />
              {focused &&(
                <View
                  style={{
                    position:"absolute",
                    bottom:-21.5,
                    width:60,
                    height:4,
                    backgroundColor:"black",
                    borderRadius:2,
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
