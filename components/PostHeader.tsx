import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MoreHorizontal, Check } from 'lucide-react-native';
import { User } from '@/types/post';

interface PostHeaderProps {
  user: User;
}

export default function PostHeader({ user }: PostHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <TouchableOpacity>
          <Image 
          source={{ uri: user.avatar }} 
          style={styles.avatar} 
          contentFit="cover"
          transition={200} 
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.usernameContainer}>
          <TouchableOpacity>
            <Text style={styles.username}>{user.username}</Text>
          </TouchableOpacity>
          {user.verified && (
          <View style={styles.verifiedBadge}>
            <Check size={10} color="#fff" strokeWidth={3} />
          </View>
          )}
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <MoreHorizontal size={24} color="#000"/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedBadge: {
    backgroundColor: '#3897f0',
    borderRadius: 10,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
