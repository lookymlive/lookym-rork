import React, { useCallback } from 'react';
import { StyleSheet, FlatList, View, RefreshControl, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Post from '@/components/Post';
import { useFeedStore } from '@/store/feed-store';
import Colors from '@/constants/colors';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { posts, likePost, unlikePost, savePost, unsavePost } = useFeedStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleComment = (postId: string) => {
    // In a real app, this would navigate to comments screen
    console.log('Navigate to comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // In a real app, this would open share dialog
    console.log('Share post:', postId);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post
            post={item}
            onLike={likePost}
            onUnlike={unlikePost}
            onSave={savePost}
            onUnsave={unsavePost}
            onComment={handleComment}
            onShare={handleShare}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});