import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

interface StoryCircleProps {
  avatar: string;
  username: string;
  hasStory?: boolean;
  isViewed?: boolean;
  isMe?: boolean;
}

export default function StoryCircle({
  avatar,
  username,
  hasStory = true,
  isViewed = false,
  isMe = false,
}: StoryCircleProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.avatarContainer}>
        {hasStory && !isViewed ? (
          <LinearGradient
            colors={['#CA107E', '#E35157', '#F2783F']}
            start={{ x: 0.0, y: 1.0 }}
            end={{ x: 1.0, y: 1.0 }}
            style={styles.storyRing}
          >
            <View style={styles.avatarInner}>
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.storyRing, isViewed && styles.viewedStoryRing]}>
            <View style={styles.avatarInner}>
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>
          </View>
        )}
        {isMe && (
          <View style={styles.addButton}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        )}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {isMe ? 'Your story' : username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbdbdb',
  },
  viewedStoryRing: {
    backgroundColor: '#dbdbdb',
  },
  avatarInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  username: {
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3897f0',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  plusIcon: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});