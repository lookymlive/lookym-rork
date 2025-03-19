import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StoryCircle from './StoryCircle';
import { posts } from '@/mocks/posts';

export default function Stories() {
  // Extract unique users from posts
  const users = posts.map(post => post.user);
  const uniqueUsers = users.filter((user, index, self) =>
    index === self.findIndex(u => u.id === user.id)
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StoryCircle
          avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1580&q=80"
          username="Your story"
          isMe={true}
          hasStory={false}
        />
        {uniqueUsers.map((user, index) => (
          <StoryCircle
            key={user.id}
            avatar={user.avatar}
            username={user.username}
            isViewed={index % 3 === 0} // Just for demo purposes
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});