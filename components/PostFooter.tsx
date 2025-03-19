import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Heart, MessageCircle, Send, Bookmark, HeartOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { formatNumber } from '@/utils/formatters';
import Haptics from 'expo-haptics';

interface PostFooterProps {
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onUnlike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onUnsave: () => void;
}

const PostFooter: React.FC<PostFooterProps> = ({
  caption,
  hashtags,
  likes,
  comments,
  liked,
  saved,
  onLike,
  onUnlike,
  onComment,
  onShare,
  onSave,
  onUnsave,
}) => {
  const handlelLikePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (liked) {
      onUnlike();
    } else {
      onLike();
    }
  };
   const handlelSavePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (saved) {
      onUnsave();
    } else {
      onSave();
    }
  };




   const renderHashtags = () => {
    return hashtags.map((hashtag, index) => (
      <Text key={index} style={styles.hashtag}>
        {tag}{''}
      </Text>
    ));
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlelLikePress}>
            {liked ? (
              <Heart size={24} color={Colors.text} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <MessageCircle size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Send size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={onSave}>
          {saved ? (
            <Bookmark size={24} color={Colors.text} fill={Colors.text} />
          ) : (
            <Bookmark size={24} color={Colors.text} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.likesContainer}>
        <Text style={styles.likesText}>{formatNumber(likes)} likes</Text>
      </View>

      
      
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.username}>username</Text> 
          {caption}
        </Text>
       <Text style={styles.hashtagsContainer}>{renderHashtags()}</Text>
      </View>

      {comments > 0 && (
        <TouchableOpacity style={styles.commentsButton} onPress={onComment}>
          <Text style={styles.commentsText}>
            View all {formatNumber(comments)} comments
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  likesContainer: {
    marginBottom: 6,
  },
  likesText: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.text,
  },
  captionContainer: {
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  username: {
    fontWeight: '600',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  hashtag: {
    color: Colors.primary,
    fontSize: 14,
  },
  commentsButton: {
    marginTop: 2,
  },
  commentsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default PostFooter;