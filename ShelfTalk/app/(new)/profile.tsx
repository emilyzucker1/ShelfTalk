import React, { useState } from 'react';
import ProfilePhoto  from '../../components/ui/profile_photo';
import JournalEntries from '../../components/ui/journal_entries';
import CustomSwitch from '../../components/ui/switch';
import Feather from '@expo/vector-icons/Feather';
import { Text, View, StyleSheet, Switch } from 'react-native';

export default function App() {
  const [selected, setSelected] = useState("journal");

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        </View>
      <View style={styles.photoWrapper}>
        <ProfilePhoto photoUrl={null} />
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
        {selected === "journal" && (
          <JournalEntries date={'2/8/2026'} title={'Sample Title'} content={'Sample Content'} visibility={'Private'} image={null} onEdit={() => {}} onDelete={() => {}} />
        )}
        <Text>This is the profile screen</Text>
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
    top:112,
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