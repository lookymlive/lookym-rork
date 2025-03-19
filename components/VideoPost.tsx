import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Video as ExpoVideo } from 'expo-av';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Send, Bookmark, Play } from 'lucide-react-native';
import { Video } from '@/types/video';
import { useVideoStore } from '@/store/video-store';
import { useColorSchema } from '@/hooks/useColorScheme';
import { formatTimeAgo, formatLikes } from '@/utils/time-format';
import { router } from 'expo-router';

interface VideoPostProps {
  video: Video;
}

export default function VideoPost({ video }: VideoPostProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<ExpoVideo>(null);
  const { likedVideos, savedVideos, likeVideo, unlikeVideo, saveVideo, unsaveVideo } = useVideoStore();
  const { isDark, colors } = useColorSchema();
  const isLiked = likedVideos[video.id];
  const isSaved = savedVideos[video.id];

  
  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }

    setIsPlaying(!isPlaying);

    // Hide controls after a delay
    if (isPlaying) {
      setTimeout(() => {
        setShowControls(false);
      }, 2000);
    } else {
      setShowControls(true);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      unlikeVideo(video.id);
    } else {
      likeVideo(video.id);
    }
  };

  const handleSave = () => {
    if (isSaved) {
      unsaveVideo(video.id);
    } else {
      saveVideo(video.id);
    }
  };

  const handleComment = () => {
    // Navigate to comments screen
    console.log('Open comments');
  };

  const handleShare = () => {
    // Open share dialog
    console.log('Open share dialog');
  };

  const handleUserProfile = () => {
    // Navigate to user profile
    console.log('Navigate to user profile');
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
    handlePlayPause();
  };

  const handleChatWithBusiness = () => {
    if (video.user.role === 'business') {
      router.push(`/chat/${video.user.id}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserProfile}>
          <Image
            source={{ uri: video.user.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View>
            <Text style={[styles.username, { color: colors.text }]}>{video.user.username}</Text>
            {video.user.role === 'business' && (
              <Text style={[styles.businessTag, { color: colors.primary }]}>Business</Text>
            )}
          </View>
        </TouchableOpacity>
        {video.user.role === 'business' && (
          <TouchableOpacity
            style={[styles.chatButton, { backgroundColor: colors.primaryLight }]}
            onPress={handleChatWithBusiness}
          >
            <Text style={[styles.chatButtonText, { color: colors.primary }]}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        {Platform.OS !== 'web' ? (
          <ExpoVideo
            ref={videoRef}
            source={{ uri: video.videoUrl }}
            style={styles.video}
            resizeMode="cover"
            isLooping
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
              }
            }}
          />
        ) : (
          <View style={styles.webVideoFallback}>
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.thumbnailImage}
            contentFit="cover"
          />
        <View style={styles.playButtonOverlay}>
          <Play size={24} color="#fff"/>
        </View>
      </View>
        )}
       
      {showControls && (
        <View style={styles.videoControls}>
          <TouchableOpacity 
          style={styles.playButton} 
          onPress={handlePlayPause}
          >
            <View style={styles.playButtonInner}>
              {isPlaying ? (
                <View style={styles.pauseIcon}>
                  <View style={styles.pauseBar, { backgroundColor: "#fff" }} />
                  <View style={styles.pauseBar, { backgroundColor: "#fff" }} />
                </View>
              ) : (
                <Play size={24} color="#fff" fill="#fff" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart 
          size={26} 
          color={isLiked ? colors.error : colors.text} 
          fill={isLiked ? colors.error : 'transparent'} 
          />
        
        
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <MessageCircle size={26} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Send size={26} color={colors.text} />
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSave}>
          <Bookmark 
          size={26} 
          color={isSaved ? colors.text : 'transparent'} 
          fill={isSaved ? colors.text : 'transparent'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.likes, { color: colors.text }]}>{formatLikes(video.likes)} Likes</Text>
        
        <View style={styles.captionContainer}>
        < style={[styles.caption, { color: colors.text }]}>
        <Text style={styles.username}>{video.user.username}</Text>{' '}
        {video.caption}{' '}
          {video.hashtags.map((tag: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => (
            <Text style={[styles.hashtag, { color: colors.primary }]}>#{tag} </Text>
          ))}
        </Text>
      </View>
      {video.comments.length > 0 && (
        <TouchableOpacity onPress={handleComment}>
          <Text style={[styles.viewAllComments, { color: colors.textSecondary }]}>
            View {video.comments.length > 1 ? 'all ${video.comments.length} comments' : 'comment'}
            </Text>
        </TouchableOpacity>
      )}

       <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
        {formatTimeAgo(video.timestamp)} ago
        </Text>
      </View>
    </View>
  );
} 

       
  const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  businessTag: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: '500',
  },
  chatButton: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 16