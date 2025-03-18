import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, Video, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVideoStore } from '@/store/video-store';
import { useColorSchema } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/auth-store';
import { router } from 'expo-router';

export default function UploadScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { addVideo } = useVideoStore();
  const { currentUser } = useAuthStore();
 const { isDark, colors } = useColorSchema();

  // Check if user is a business
  const isBusiness = currentUser?.role === 'business';

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!videoUri || !caption || !isBusiness) return;

    setIsUploading(true);

    try {
      // In a real app, you would upload to Cloudinary here
      // For now, we'll just simulate the upload

      const hashtagArray = hashtags
        .split(' ')
        .filter(tag => tag.trim() !== '')
        .map((tag) => tag.replace('#', '').trim());
        
        // Add the video to our local store
         addVideo({
        caption,
        hashtags: hashtagArray,
        thumbnailUri: 'https://images.unsplash.com/photo-1511116475-46b65813f2fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        videoUrl: videoUri,
      });

      // Reset form
      setVideoUri(null);
      setCaption('');
      setHashtags('');

      // Navigate to feed
      router.push('/');
    } catch (error) {
      console.error('Error uploading video: ', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isBusiness) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
        <View style={styles.notBusinessContainer}>
          <Text style={[styles.notBusinessText, { color: Colors.text }]}>
            Only business accounts can upload videos
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: Colors.text }]}>Upload New Video</Text>

        <View style={styles.videoSection}>
          {videoUri ? (
            <View style={styles.videoPreviewContainer}>
              {Platform.OS !== 'web' ? (
                <Video width={24} height={24} color={Colors.primary} />
              ) : (
                <video src={videoUri} style={styles.videoPreview} controls />
              )}
              <Text style={[styles.videoSelected, { color: Colors.text }]}>Video selected</Text>
              <TouchableOpacity style={styles.removeVideo} onPress={() => setVideoUri(null)}>
                <X size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadButton, { borderColor: Colors.border }]}
              onPress={pickVideo}
            >
              <Plus size={40} color={Colors.primary} />
              <Text style={[styles.uploadText, { color: Colors.text }]}>Select Video</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: Colors.text }]}>Caption</Text>
          <TextInput
            style={[styles.input, { backgroundColor: Colors.card, color: Colors.text, borderColor: Colors.border }]}
            placeholder="Write a caption..."
            placeholderTextColor={Colors.textSecondary}
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <Text style={[styles.label, { color: Colors.text }]}>Hashtags</Text>
          <TextInput
            style={[styles.input, { backgroundColor: Colors.card, color: Colors.text, borderColor: Colors.border }]}
            placeholder="Add hashtags separated by spaces"
            placeholderTextColor={Colors.textSecondary}
            value={hashtags}
            onChangeText={setHashtags}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: videoUri && caption ? Colors.primary : Colors.disabled },
            ]}
            onPress={handleUpload}
            disabled={!videoUri || !caption || isUploading}
          >
            <Upload size={20} color="#fff" style={styles.submitIcon} />
            <Text style={styles.submitText}>
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoSection: {
    marginBottom: 24,
  },
  uploadButton: {
    height: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  videoPreviewContainer: {
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoSelected: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  removeVideo: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 50,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notBusinessContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notBusinessText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});