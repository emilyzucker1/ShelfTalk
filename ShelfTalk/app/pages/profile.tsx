import AddJournal from '@/components/ui/add_journal';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import JournalEntries from '../../components/ui/journal_entries';
import ProfilePhoto from '../../components/ui/profile_photo';
import CustomSwitch from '../../components/ui/switch';
import EditProfileModal from '@/components/ui/edit_profile';
import { Platform } from "react-native";
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  type JournalEntry = {
    title: string;
    date: string;
    entry: string;
    book: string;
    status: "Started" | "Finished";
    image: string | null;
  };

  const [selected, setSelected] = useState("journal");
  const [entries, setEntries]=useState<JournalEntry[]>([]);
  const[popupVisible,setPopupVisible]=useState(false);
  const[editingIndex,setEditingIndex]=useState<number| null>(null);
  const [username, setUsername] = useState("Username");
  const [description, setDescription]= useState("Hi, this is " + {username} + ". I have a great interest in reading novels and love historical books.");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  const handleSaveProfile = (updated: { username: string; description: string; photoUrl: string | null }) => {
    setUsername(updated.username);
    setDescription(updated.description);
    setProfilePhotoUrl(updated.photoUrl);
    setEditProfileVisible(false);

  };

  const handleNewEntry=(entryData: JournalEntry)=>{
    if (editingIndex !== null) {
      // EDITING an existing entry
      const updated = [...entries];
      updated[editingIndex] = entryData;
      setEntries(updated);
      setEditingIndex(null);
    } else {
      // ADDING a new entry
      setEntries(prev => [...prev, entryData]);
      //its is where we recieve entry data, this is where we could connect it to the database.
    }
  };
  

  return (
    <View style={styles.pageWrapper}>
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <Pressable style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <Feather name="settings" size={24} color="white" />
        </Pressable>
        </View>
      <View style={styles.photoWrapper}>
        <View style={styles.photoWrapper}>
          <ProfilePhoto
            photoUrl={profilePhotoUrl}
            onEdit={() => setEditProfileVisible(true)}
          />
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <Text style={{fontSize:30, fontWeight:'500'}}>{username}</Text>
        <Text style={{width: Platform.OS === "web" ? "80%" : 350, maxWidth: 500, fontSize:15, fontWeight:'400', color:'#748B97', textAlign:'center', paddingTop:20}}> {description}
        </Text>
        <View style={styles.row}>
          <Feather name="book" size={24} color="black" />
          <Text style= {{fontSize:15, fontWeight:'400'}}>Public Journal Entries: {entries.length}</Text>
        </View>
        <CustomSwitch selected={selected} onSelectChange={setSelected} />
        <View style={{ flex: 1, width: "100%" }}>
          {selected === "journal" && (
            <>
              <View
                
                style={{
                  padding: 15,
                  paddingLeft:20,
                  backgroundColor: "transparent",
                  borderRadius: 8,
                  alignItems: "center",
                  flexDirection:"row",
                  gap:8,
                }}
              >
                <Pressable onPress={() => setPopupVisible(true)}>
                <View style={{
                  width:28,
                  height:27,
                  backgroundColor:"#90B8A8",
                  borderRadius:7.4,
                  alignItems:"center",
                  justifyContent:"center",
                }}>
                  <AntDesign name="plus" size={24} color="white" />
                </View>
                </Pressable>
                <Text style={{ color: "#F4A896", fontWeight: "500" }}>
                  Log New Entry
                </Text>
              </View>

              <AddJournal
                visible={popupVisible}
                onClose={() => {setPopupVisible(false);
                  setEditingIndex(null);
                }}
                onSubmit={handleNewEntry}
                initialData={editingIndex!=null? entries[editingIndex]:null}
              />

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingVertical: 20,
                }}
                showsVerticalScrollIndicator={false}
              >
                {entries.map((item, index) => (
                  <JournalEntries
                    key={index}
                    date={item.date}
                    title={item.title}
                    content={item.entry}
                    status={item.status}
                    image={item.image}
                    book={item.book}
                    onEdit={()=>{
                      setEditingIndex(index);
                      setPopupVisible(true);
                    }}
                  />
                ))}

              </ScrollView>
            </>
          )}
        </View>
      </View>
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        username={username}
        photoUrl={profilePhotoUrl}
        description={description}
        onSave={handleSaveProfile}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
    pageWrapper: {
      flex: 1,
      width:"100%",
      alignItems: Platform.OS === "web" ? "center" : "stretch",
      backgroundColor: "#E6F2F0",
    },
    container: {
      width: Platform.OS === "web" ? 500 : "100%",
      flex: 1,
      backgroundColor: "#E6F2F0",
    },

  row:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:15,
    paddingBottom:10,
    gap:8,

  },
  topHalf: {
    width: "100%",
    height: Platform.OS === "web" ? 150 : "35%",
    backgroundColor: "#90B8A8",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
  },


  photoWrapper: {
    position: "absolute",
    top: Platform.OS === "web" ? 5 : 40,
    left: "50%",
    transform: [{ translateX: Platform.OS === "web" ? -40 : -75 }],
    zIndex: 10,
    alignItems: "center",
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  


  bottomHalf: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },

});