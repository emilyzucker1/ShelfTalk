import React, { useState } from 'react';
import ProfilePhoto  from '../../components/ui/profile_photo';
import AddJournal from '@/components/ui/add_journal';
import JournalEntries from '../../components/ui/journal_entries';
import CustomSwitch from '../../components/ui/switch';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';

export default function App() {
  type JournalEntry = {
    title: string;
    date: string;
    entry: string;
    status: "Started" | "Finished";
    image: string | null;
  };

  const [selected, setSelected] = useState("journal");
  const [entries, setEntries]=useState<JournalEntry[]>([]);
  const[popupVisible,setPopupVisible]=useState(false);
  const[editingIndex,setEditingIndex]=useState<number| null>(null);
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
    <View style={styles.container}>
      <View style={styles.topHalf}>
        </View>
      <View style={styles.photoWrapper}>
        <ProfilePhoto />
      </View>
      <View style={styles.bottomHalf}>
        <Text style={{fontSize:30, fontWeight:'500'}}>Username</Text>
        <Text style={{width:350,fontSize:15, fontWeight:'400', color:'#748B97', textAlign:'center', paddingTop:20}}> Hi, this is yourname. I have a great interest
in reading novels and love historical books.
        </Text>
        <View style={styles.row}>
          <Feather name="book" size={24} color="black" />
          <Text style= {{fontSize:15, fontWeight:'400'}}>Public Journal Entries: 10</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2F0',
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:15,
    paddingBottom:10,
    gap:8,

  },
  topHalf:{
    flex: 1,
    backgroundColor:'#90B8A8',
    justifyContent:'flex-start',
    alignItems:'center',
    paddingTop:60,
  },
  photoWrapper:{
    position:'absolute',
    top:85,
    left:'50%',
    transform:[{translateX:-75}],
    zIndex:10,
    alignItems:'center',
  },
  bottomHalf:{
    flex: 3,
    justifyContent:'flex-start',
    alignItems:'center',
    paddingTop:10,
},
});