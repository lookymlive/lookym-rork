import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorSchema } from '@/hooks/useColorScheme';

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  comments: string[];
}

const Post: React.FC<PostProps> = ({ id, title, content, author, date, comments }) => {
  const router = useRouter();
  const { colors } = useColorSchema();
  const [showFullContent, setShowFullContent] = useState(false);

  const handlePostTap = useCallback(() => {
    if (!showFullContent) {
      setShowFullContent(true);
    } else {
      router.push(`/post/${id}`);
    }
  }, [showFullContent, id, router]);

  const handleNotificationComplete = useCallback(() => {
    // Lógica para manejar la notificación completa
  }, []);

  return (
    <TouchableOpacity style={[styles.postContainer, { backgroundColor: colors.background }]} onPress={handlePostTap}>
      <View style={styles.postHeader}>
        <Text style={[styles.postTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.postDate, { color: colors.textSecondary }]}>{date}</Text>
      </View>

      <View style={styles.postContent}>
        <Text style={[styles.postAuthor, { color: colors.text }]}>{author}</Text>
        <Text style={[styles.postText, { color: colors.text }]}>
          {showFullContent ? content : `${content.substring(0, 100)}...`}
        </Text>
        <Text style={[styles.postComments, { color: colors.textSecondary }]}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </Text>
      </View>

      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
  },
  postContent: {
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 14,
  },
  postComments: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default Post;