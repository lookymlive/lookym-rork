import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { Video } from '@/types/video';
import { useColorSchema } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { formatLikes } from '@/utils/time-format';

interface VideoThumbnailProps {
  video: Video;
  listMode?: boolean;
}

const THUMBNAIL_SIZE = Dimensions.get('window').width / 2 - 8;

export default function VideoThumbnail({ video, listMode = false }: VideoThumbnailProps) {
  const { colors } = useColorSchema();

  const handlePress = () => {
    // Navigate to video detail
    console.log('Navigate to video detail', video.id);
  };

  if (listMode) {
    return (
      <TouchableOpacity style={[styles.listItemContainer, { backgroundColor: colors.card }]} onPress={handlePress}>
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <View style={styles.listItemContent}>
          <Text style={[styles.listItemCaption, { color: colors.text }]} numberOfLines={2}>
            {video.caption}
          </Text>
          <View style={styles.listItemMeta}>
            <Text style={[styles.listItemUsername, { color: colors.textSecondary }]}>
              {video.user.username}
            </Text>
            <Text style={[styles.listItemLikesCount, { color: colors.textSecondary }]}>
              {formatLikes(video.likes)} likes
            </Text>
          </View>
          <View style={styles.listItemHashtags}>
            {video.hashtags.map((tag) => (
              <View style={styles.hashtagPill}>
                <Text style={[styles.hashtagText, { color: colors.primary }]}>#{tag}</Text>
              </View>
            ))}
          </View>
          {video.hashtags.length > 1 && (
            <Text style={[styles.listItemMoreHashtags, { color: colors.textSecondary }]}>
              + {video.hashtags.length - 3}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: video.thumbnailUrl }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <Play size={30} color="white" fill="white" />
      </View>
      <Text style={styles.likesCount}>{formatLikes(video.likes)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    margin: 2,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  likesCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listItemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  listItemThumbnail: {
    width: 120,
    height: 120,
  },
  listItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listItemCaption: {
    fontWeight: '600',
    marginBottom: 8,
  },
  listItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemUsername: {
    fontSize: 12,
  },
  listItemLikesCount: {
    fontSize: 12,
  },
  listItemHashtags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 6,
    marginBottom: 6,
  },
  hashtagText: {
    fontSize: 10,
  },
  listItemMoreHashtags: {
    fontSize: 10,
    alignSelf: 'center',
  },
});