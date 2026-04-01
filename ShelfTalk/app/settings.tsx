import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { getUserProfile, updateUserProfile } from './backend/user_info';
import { auth, storage } from './firebase';

export default function SettingsPage() {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/newLogin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.currentUser) {
        return;
      }

      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        const userBio = (profile as { bio?: unknown } | null)?.bio;
        const userPhotoUrl = (profile as { photoURL?: unknown } | null)?.photoURL;
        if (typeof userBio === 'string') {
          setBio(userBio);
        }
        if (typeof userPhotoUrl === 'string') {
          setCurrentPhotoUrl(userPhotoUrl);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleSelectImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to upload a profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Image error', 'Could not select image. Please try again.');
    }
  };

  const uploadProfileImage = async (userId: string, localUri: string) => {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const imageRef = ref(storage, `users/${userId}/profile/${Date.now()}.jpg`);
    await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });
    return getDownloadURL(imageRef);
  };

  const handleSaveChanges = async () => {
    if (!auth.currentUser) {
      Alert.alert('Not signed in', 'Please sign in again to save your profile.');
      return;
    }

    try {
      setIsSaving(true);
      let photoURLToSave = currentPhotoUrl;

      if (selectedImageUri) {
        photoURLToSave = await uploadProfileImage(auth.currentUser.uid, selectedImageUri);
      }

      await updateUserProfile(auth.currentUser.uid, {
        bio: bio.trim(),
        photoURL: photoURLToSave,
      });

      if (photoURLToSave) {
        setCurrentPhotoUrl(photoURLToSave);
      }

      router.replace('/pages/profile' as any);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Save failed', 'We could not save your changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="left" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <Pressable style={styles.imageUploadContainer} onPress={handleSelectImage}>
            {selectedImageUri || currentPhotoUrl ? (
              <Image
                source={{ uri: selectedImageUri || currentPhotoUrl }}
                style={styles.profilePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <AntDesign name="camera" size={40} color="#90B8A8" />
                <Text style={styles.uploadText}>Tap to upload</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.saveButton} onPress={handleSaveChanges} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
    backgroundColor: '#90B8A8',
  },
  backButton: {
    padding: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  imageUploadContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: '#90B8A8',
    fontWeight: '500',
  },
  bioInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: '#90B8A8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#F4A896',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});