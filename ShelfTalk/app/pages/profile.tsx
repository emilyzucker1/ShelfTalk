import AddJournal from '@/components/ui/add_journal';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import JournalEntries from '../../components/ui/journal_entries';
import ProfilePhoto from '../../components/ui/profile_photo';
import CustomSwitch from '../../components/ui/switch';
import EditProfileModal from '@/components/ui/edit_profile';
import { Platform } from "react-native";
import { useRouter } from 'expo-router';
import BookShelf from "../../components/ui/book_shelf";
import { createPost } from "../backend/create_post";
import { getUserPosts } from '../backend/get_post';
import { getUserProfile } from '../backend/user_info';
import { userID, username } from '../firebase';

export default function App() {
  const router = useRouter();
  const defaultDescription = `Hi, this is ${username || "Username"}. I have a great interest in reading novels and love historical books.`;
  type JournalEntry = {
    id?: string;
    title: string;
    date: string;
    entry: string;
    book?: string;
    status: "Started" | "Finished";
    isPublic: boolean;
    image: string | null;
  };

  const [selected, setSelected] = useState("journal");
  const [entries, setEntries]=useState<JournalEntry[]>([]);
  const[popupVisible,setPopupVisible]=useState(false);
  const[editingIndex,setEditingIndex]=useState<number| null>(null);

  //const [username, setUsername] = useState("Username");
  const [description, setDescription] = useState(defaultDescription);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  //load in actual shelve data from database
  const dummyShelves = [
    {
      id: 1,
      title: "The Night Circus",
      author: "Erin Morgenstern",
      cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      status: "Finished",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://covers.openlibrary.org/b/id/9874151-L.jpg",
      status: "Currently Reading",
    },
    {
      id: 3,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      cover: "https://covers.openlibrary.org/b/id/10521241-L.jpg",
      status: "Currently Reading",
    },
  ];

  const mapPostToEntry = (post: any): JournalEntry => {
    const isPublicValue =
      post?.isPublic === true || post?.isPublic === "true" || post?.isPublic === "Public";

    const mappedStatus: "Started" | "Finished" =
      post?.status === "Finished"
        ? "Finished"
        : "Started";

    return {
      id: post?.id,
      title: post?.title ?? post?.book ?? "Untitled",
      book: post?.book ?? "Untitled",
      date: post?.createdAt?.toDate
        ? post.createdAt.toDate().toLocaleDateString()
        : "",
      entry: post?.text ?? "",
      status: mappedStatus,
      isPublic: isPublicValue,
      image: post?.image ?? null,
    };
  };

  const loadEntries = async () => {
    try {
      const posts = await getUserPosts(userID);
      if (!posts) {
        setEntries([]);
        return;
      }
      setEntries(posts.map(mapPostToEntry));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(userID);
      const userBio = (profile as { bio?: unknown } | null)?.bio;
      const userPhotoUrl = (profile as { photoURL?: unknown } | null)?.photoURL;

      if (typeof userBio === 'string' && userBio.trim().length > 0) {
        setDescription(userBio);
      } else {
        setDescription(defaultDescription);
      }

      if (typeof userPhotoUrl === 'string' && userPhotoUrl.trim().length > 0) {
        setProfilePhotoUrl(userPhotoUrl);
      } else {
        setProfilePhotoUrl(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setDescription(defaultDescription);
      setProfilePhotoUrl(null);
    }
  };

  useEffect(() => {
    loadEntries();
    loadUserProfile();
  }, []);

  const publicEntriesCount = entries.filter((entry) => entry.isPublic).length;

  const handleNewEntry=async(entryData: JournalEntry)=>{
    if (editingIndex !== null) {
      // EDITING an existing entry
      const updated = [...entries];
      updated[editingIndex] = entryData;
      setEntries(updated);
      setEditingIndex(null);
    } else {
      // ADDING a new entry
      setEntries(prev => [...prev, entryData]);
      
      try {
        await createPost(entryData.book ?? entryData.title, entryData.entry, userID, username, entryData.isPublic);
        await loadEntries();
      }
      catch (error) {
        console.error("Failed to create post in database:", error);
      }
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
          />
        </View>
      </View>
      <View style={styles.bottomHalf}>
        <Text style={{fontSize:30, fontWeight:'500'}}>{username}</Text>
        <Text style={{width: Platform.OS === "web" ? "80%" : 350, maxWidth: 500, fontSize:15, fontWeight:'400', color:'#748B97', textAlign:'center', paddingTop:20}}> {description}
        </Text>
        <View style={styles.row}>
          <Feather name="book" size={24} color="black" />
          <Text style= {{fontSize:15, fontWeight:'400'}}>Public Journal Entries: {publicEntriesCount}</Text>
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
                    key={item.id ?? index}
                    date={item.date}
                    title={item.title}
                    content={item.entry}
                    status={item.status}
                    visibility={item.isPublic ? "Public" : "Private"}
                    image={item.image}
                    onEdit={()=>{
                      setEditingIndex(index);
                      setPopupVisible(true);
                    }}
                  />
                ))}

              </ScrollView>
            </>
          )}
          {selected === "shelves" && (
            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {dummyShelves.map((book) => (
                <BookShelf
                  key={book.id}
                  title={book.title}
                  cover_image={book.cover}
                  status={book.status}
                />
              ))}
            </ScrollView>

          )}
        </View>
      </View>
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