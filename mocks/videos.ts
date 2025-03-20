import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '@/types/video';
import { supabase } from '@/utils/supabase';
import { uploadVideo, getVideoThumbnailUrl } from '@/utils/cloudinary';
import { useAuthStore } from './auth-store';


interface VideoState {
  videos: Video[];
  likedVideos: Record<string, boolean>;
  savedVideos: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  saveVideo: (videoId: string) => Promise<void>;
  unsaveVideo: (videoId: string) => Promise<void>;
  addComment: (videoId: string, comment: string) => Promise<void>;
  uploadVideo: (videoUri: string, caption: string, hashtags: string[]) => Promise<void>;
  fetchVideos: (page: number, limit: number) => Promise<void>;
  fetchVideosByUser: (userId: string) => Promise<void>;
  fetchVideoById: (videoId: string) => Promise<Video | null>;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
  videos: initialVideos,
  likedVideos: {},
  savedVideos: {},
  isLoading: false,
  error: null,

  likeVideo: async (videoId: string) => {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      // In a real app with Supabase
      // 1. Update likes count in videos table
      const { error: updateError } = await supabase.rpc('increment_video_likes', {
        video_id: videoId
      });
      if (updateError) throw updateError;

      // 2. Add record to video_likes table
      const { error: likeError } = await supabase
        .from('video_likes')
        .insert([
          {
            user_id: currentUser.id,video_id: videoId }
        ]);
      if (likeError) throw likeError;

      // Update local state
      set((state) => {
        const updatedVideos = state.videos.map((video) => 
          video.id === videoId ? { ...video, likes: video.likes + 1 } : video
        );
        
        return { 
          videos: updatedVideos, 
          likedVideos: { ...state.likedVideos, [videoId]: true } 
      };
      });
    } catch (error: any) {
      console.error('Like video error', error.message);
      // Don't revert state if the API call fails
      throw error;
    }
  },

  unlikeVideo: async (videoId: string) => {
      try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      // In a real app with Supabase
      // 1. Update likes count in videos table
      const { error: updateError } = await supabase.rpc('decrement_video_likes', {
        video_id: videoId
      });

      if (updateError) throw updateError;

      // 2. Remove record from video_likes table
      const { error: unlikeError } = await supabase
        .from('video_likes')
        .delete()
        .match({ user_id: currentUser.id, video_id: videoId });

      if (unlikeError) throw unlikeError;

      // Update local state
      set((state) => ({
        videos: state.videos.map(video =>
          video.id === videoId ? { ...video, likes: Math.max(0, video.likes - 1) } : video
        ),
        const newLikedVideos = { ...state.likedVideos },
        delete newLikedVideos[videoId];
        return {
          videos: updateVideos,
          likedVideos: newLikedVideos
        };
      }));  
    } catch (error: any) {
      console.error('Unlike video error', error.message);
      // Don't update state if the API call fails
      throw error;
    }
  },

  saveVideo: async (videoId: string) => {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      // In a real app with Supabase
      // Add record to saved_videos table
      supabase
        .from('saved_videos')
        .insert([
          {
            user_id: currentUser.id,video_id: videoId }
        ]);

      // Update local state immediately for better UX
      set((state) => ({
        savedVideos: { ...state.savedVideos, [videoId]: true }
      }));
    } catch (error: any) {
      console.error('Save video error', error.message);
      // State is already updated, so no need to revert
    }
  },

  unsaveVideo: async (videoId: string) => {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      // In a real app with Supabase
      // Remove record from saved_videos table
      const { error: unsaveError } = await supabase
        .from('saved_videos')
        .delete()
        .match({ user_id: currentUser.id, video_id: videoId })
        .then((error) trow error;
      })
      if (unsaveError) throw unsaveError;

      // Update local state immediately for better UX
      set((state) => ({
       const newSavedVideos = { ...state.savedVideos };
       delete newSavedVideos[videoId];
       return { savedVideos: newSavedVideos};
      }));
    }
    catch (error: any) {
        console.error('Unsave video error', error.message);
        // State is already updated, so no need to revert
      }
    },
      

  addComment: async (videoId: string, commentText: string) => {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');

      // In a real app with Supabase
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
          video_id: videoId,
          user_id: currentUser.id,
          text: commentText
          }
        ])
        .select('*, user:users(*)');

      if (error) throw error;

      // Format the comment for our app
      const newComment = {
        id: data[0].id,
        user: {
          id: data[0].user.id,
          username: data[0].user.username,
          avatar: data[0].user.avatar_url,
          verified: data[0].user.verified,
          role: data[0].user.role,
        },
        text: data[0].text,
        timestamp: new Date(data[0].created_at).getTime(),
        likes: 0,
      };

      // Update local state
      set((state) => ({
        videos: state.videos.map(video => {
          if (video.id === videoId) {
            return {
              ...video,
              comments: [...video.comments, newComment]
            };
          } 
          return video;
        })
      }));
      
    } catch (error: any) {
      console.error('Add comment error', error.message);
      throw error;
    }
  },

  uploadVideo: async (videoUri: string, caption: string, hashtags: string[]) => {
    try {
      set({ isLoading: true, error: null });

      const currentUser = useAuthStore.getState().currentUser;
      if (!currentUser) throw new Error('User not authenticated');
      if (currentUser.role !== 'business') throw new Error('Only business accounts can upload videos');

      // 1. Upload to Cloudinary
      const uploadResult = await uploadVideo(videoUri, {
        resource_type: 'video',
        folder: `lookym/${currentUser.id}`,
        public_id: `video_${Date.now()}`,
      });

      // 2. Save to Supabase
      const { data, error } = await supabase
        .from('videos')
        .insert([
          {
            user_id: currentUser.id,
            video_url: uploadResult.secure_url,
            thumbnail_url: getVideoThumbnailUrl(uploadResult.public_id),
            caption,
            hashtags,
          }
        ])
        .select('*, user:users(*)'); 

      if (error) throw error;

      // 3. Format the video for our app
      const newVideo: Video = {
        id: data[0].id,
        user: {
          id: data[0].user.id,
          username: data[0].user.username,
          avatar: data[0].user.avatar_url,
          verified: data[0].user.verified,
          role: data[0].user.role,
        },
        videoUrl: data[0].video_url,
        thumbnailUrl: data[0].thumbnail_url,
        caption: data[0].caption,
        hashtags: data[0].hashtags,
        likes: 0,
        comments: [],
        timestamp: new Date(data[0].created_at).getTime(),
      };

      // 4. Update local state
      set((state) => ({
        videos: [...state.videos, newVideo],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Upload video error', error.message);
      set({ error: error.message, isLoading: false});
      throw error;
    }
  },
  

  
  
  fechVideos: async (page: number, limit: 10) => {
    try {
      set({ isLoading: true, error: null });

      // In a real app with Supabase
      const { data, error } = await supabase
      .from('videos')
      .select(`
        *, 
        user:users(*)
      `)
        ')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;

      // Format the videos for our app
      const formattedVideos = data.map((video) => {
        return {
          id: video.id,
          user: {
            id: video.user.id,
            username: video.user.username,
            avatar: video.user.avatar_url,
            verified: video.user.verified,
            role: video.user.role,
          },
          videoUrl: video.video_url,
          thumbnailUrl: video.thumbnail_url,
          caption: video.caption,
          hashtags: video.hashtags,
          likes: video.likes,
          comments: video.comments.map((comment: any) => ({
            id: comment.id,
            user: {
              id: comment.user.id,
              username: comment.user.username,
              avatar: comment.user.avatar_url,
              verified: comment.user.verified,
              role: comment.user.role,
            },
            text: comment.text,
            timestamp: new Date(comment.created_at).getTime(),
            likes: comment.likes,
          })),
          timestamp: new Date(video.created_at).getTime(),
        }
      });

      // Update local state
      set(state => ({
        videos: page === 1 ? formattedVideos : [...state.videos, ...formattedVideos],
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Fetch videos error', error.message);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fechVideosByUser: async (userId: string) => {
    try { 
      set({ isLoading: true, error: null });

      // In a real app with Supabase
      const { data, error } = await supabase
      .from('videos')
      .select(`
        *, 
        user:users(*),
        comments:comments(
          *,
          user:users(*)
        )
        ')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format the videos for our app
      const formattedVideos: Video[] = data.map(video => {
        return {
          id: video.id,
          user: {
            id: video.user.id,
            username: video.user.username,
            avatar: video.user.avatar_url,
            verified: video.user.verified,
            role: video.user.role,
          },
          videoUrl: video.video_url,
          thumbnailUrl: video.thumbnail_url,
          caption: video.caption,
          hashtags: video.hashtags,
          likes: video.likes,
          comments: video.comments.map((comment: any) => ({
            id: comment.id,
            user: {
              id: comment.user.id,
              username: comment.user.username,
              avatar: comment.user.avatar_url,
              verified: comment.user.verified,
              role: comment.user.role,
            },
            text: comment.text,
            timestamp: new Date(comment.created_at).getTime(),
            likes: comment.likes,
          })),
          timestamp: new Date(video.created_at).getTime(),
        }
      });

      // Update local state
      set({
        videos: formattedVideos,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Fetch videos by user error', error.message);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fechVideoById: async (videoId: string) => {
    try {
      set({ isLoading: true, error: null });

      // In a real app with Supabase
      const { data, error } = await supabase
      .from('videos')
      .select(`
        *, 
        user:users(*),
        comments:comments(
          *,
          user:users(*)
        )
        ')
        .eq('id', videoId)
        .single();

      if (error) throw error;

      
