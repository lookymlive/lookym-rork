import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '@/types/post';
import { Posts as initialPosts } from '@/mocks/posts';
import { Verified } from 'lucide-react-native';

interface FeedState {
  posts: Post[];
  likedPosts: Record<string, boolean>;
  savedPosts: string[];
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
}
export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      posts: initialPosts,
      likedPosts: {},
      savedPosts: [],
      likePost: (postId: string) => 
        set((state) => {
          const updatedPosts = state.posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          );
          return {
            posts: updatedPosts,
            likedPosts: { ...state.likedPosts, [postId]: true },
          };
        }),
       unlikePost: (postId: string) => 
        set((state) => {
          const updatedPosts = state.posts.map((post) =>
            post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post
          );
          const newLikedPosts = { ...state.likedPosts };
          delete newLikedPosts[postId];
          return {
            posts: updatedPosts,
            likedPosts: newLikedPosts,
          };
        }),
      savePost: (postId: string) => 
        set((state) => ({
          savedPosts: [...state.savedPosts, postId],
        })),
      unsavePost: (postId: string) => 
        set((state) => {
          const newSavedPosts = state.savedPosts.filter((id) => id !== postId);
          return { savedPosts: newSavedPosts };
        }),        

       addComment: (postId: string, commentText: string) => 
        set((state) => {
          const updatedPosts: Post[] = state.posts.map((post) => {
            if (post.id === postId) {             
              const newComment = {
                id: `c${Date.now()}`,
                user: {
                  id: 'currentUser',
                  username: 'me',
                  avatar: 'https://images.unsplash.com/photo-1535713875881-d1d8cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=158&q=80',
                  Verified: false,
                },
                text: commentText,
                timestamp: Date.now(),
                likes: 0,
              };
              return {
                ...post,
                comments: [...post.comments, newComment],
              };
            }
            return post;
          });
          return { posts: updatedPosts };
        }),
    }),
    {
          name: 'feed-storage',
          storage: createJSONStorage(() => AsyncStorage),
          partialize: (state) => ({
            likedPosts: state.likedPosts,
            savedPosts: state.savedPosts,
          }),
        })
);
