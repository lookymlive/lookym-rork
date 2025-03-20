import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '@/types/video';
import { InitialVideos } from '@/mocks/videos';
import { uploadVideo, getVideoThumbnailUrl } from '@/utils/cloudinary';
import { uploadVideo as uploadVideoSupabase, getVideoThumbnailUrl as getVideoThumbnailUrlSupabase } from '@/utils/supabase';

interface VideoState {
  videos: Video;
  isLoading: boolean;
  error: string | null;
  likeVideo: (videoId: string) => Promise<void>;
  unlikeVideo: (videoId: string) => Promise<void>;
  saveVideo: (videoId: string) => Promise<void>;
  unsaveVideo: (videoId: string) => Promise<void>;
  uploadVideo: (videoUri: string, caption: string, hashtags: string) => Promise<void>;
  fetchVideos: (page: number, limit: number) => Promise<void>;
  fetchVideosByUserId: (userId: string) => Promise<void>;
  fetchVideosByHashtag: (hashtag: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: InitialVideos,
      isLoading: false,
      error: null,
      likeVideo: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = useAuthStore.getState().currentUser;
          if (!currentUser) throw new Error('User not authenticated');

          // In a real app with Supabase
          const { error: updateError } = await supabase
            .from('videos')
            .update({ likes: get().videos.find((v) => v.id === videoId)!.likes + 1 })
            .eq('id', videoId);

          if (updateError) throw updateError;

          // Update local state immediately for better UX
          set((state) => ({
            videos: state.videos.map((video) =>
              video.id === videoId ? { ...video, likes: video.likes + 1 } : video
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Like video error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      unlikeVideo: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = useAuthStore.getState().currentUser;
          if (!currentUser) throw new Error('User not authenticated');

          // In a real app with Supabase
          const { error: updateError } = await supabase
            .from('videos')
            .update({ likes: Math.max(0, get().videos.find((v) => v.id === videoId)!.likes - 1) })
            .eq('id', videoId);

          if (updateError) throw updateError;

          // Update local state immediately for better UX
          set((state) => ({
            videos: state.videos.map((video) =>
              video.id === videoId ? { ...video, likes: Math.max(0, video.likes - 1) } : video
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Unlike video error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      saveVideo: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = useAuthStore.getState().currentUser;
          if (!currentUser) throw new Error('User not authenticated');

          // In a real app with Supabase
          const { error: insertError } = await supabase
            .from('saved_videos')
            .insert({ user_id: currentUser.id, video_id: videoId });

          if (insertError) throw insertError;

          // Update local state immediately for better UX
          set((state) => ({
            videos: state.videos.map((video) =>
              video.id === videoId ? { ...video, saved: true } : video
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Save video error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      unsaveVideo: async (videoId: string) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = useAuthStore.getState().currentUser;
          if (!currentUser) throw new Error('User not authenticated');

          // In a real app with Supabase
          const { error: deleteError } = await supabase
            .from('saved_videos')
            .delete()
            .eq('user_id', currentUser.id)
            .eq('video_id', videoId);

          if (deleteError) throw deleteError;

          // Update local state immediately for better UX
          set((state) => ({
            videos: state.videos.map((video) =>
              video.id === videoId ? { ...video, saved: false } : video
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Unsave video error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      uploadVideo: async (videoUri: string, caption: string, hashtags: string) => {
        set({ isLoading: true, error: null });
        try {
          const currentUser = useAuthStore.getState().currentUser;
          if (!currentUser) throw new Error('User not authenticated');
          if (!currentUser.isBusiness) throw new Error('Only business accounts can upload videos');

          // 1. Upload video to Cloudinary
          const uploadResult = await uploadVideo(videoUri);
          const thumbnailUrl = await getVideoThumbnailUrl(uploadResult.secure_url);

          // 2. Save to Supabase
          const { data, error } = await supabase.from('videos').insert([
            {
              user_id: currentUser.id,
              video_url: uploadResult.secure_url,
              thumbnail_url: thumbnailUrl,
              caption,
              hashtags,
            },
          ]).select();

          if (error) throw error;

          // 3. Format the video for our app
          const newVideo: Video = {
            id: data[0].id,
            user: {
              id: currentUser.id,
              username: currentUser.username,
              avatar: currentUser.avatarUrl,
              verified: currentUser.isVerified,
              role: currentUser.role,
            },
            videoUrl: data[0].video_url,
            thumbnailUrl: data[0].thumbnail_url,
            caption: data[0].caption,
            hashtags: data[0].hashtags,
            likes: 0,
            comments:,
            timestamp: new Date(data[0].created_at).getTime(),
            saved: false,
          };

          // 4. Update local state
          set((state) => ({
            videos: [newVideo, ...state.videos],
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Upload video error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      fetchVideos: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with Supabase
          const { data, error } = await supabase
            .from('videos')
            .select('*, user:users(*), comments:comments(*, user:users(*))')
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

          if (error) throw error;

          // Format the videos for our app
          const formattedVideos: Video= data.map((video: any) => ({
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
            })),
            timestamp: new Date(video.created_at).getTime(),
            saved: false, // Determine if the video is saved by the current user
          }));

          set({ videos: formattedVideos, isLoading: false });
        } catch (error: any) {
          console.error('Fetch videos error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      fetchVideosByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with Supabase
          const { data, error } = await supabase
            .from('videos')
            .select('*, user:users(*), comments:comments(*, user:users(*))')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Format the videos for our app
          const formattedVideos: Video= data.map((video: any) => ({
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
            })),
            timestamp: new Date(video.created_at).getTime(),
            saved: false, // Determine if the video is saved by the current user
          }));

          set({ videos: formattedVideos, isLoading: false });
        } catch (error: any) {
          console.error('Fetch user videos error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      fetchVideosByHashtag: async (hashtag: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app with Supabase
          const { data, error } = await supabase
            .from('videos')
            .select('*, user:users(*), comments:comments(*, user:users(*))')
            .like('hashtags', `%${hashtag}%`)
            .order('created_at', { ascending: false });

          if (error) throw error;

          // Format the videos for our app
          const formattedVideos: Video= data.map((video: any) => ({
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
            })),
            timestamp: new Date(video.created_at).getTime(),
            saved: false, // Determine if the video is saved by the current user
          }));

          set({ videos: formattedVideos, isLoading: false });
        } catch (error: any) {
          console.error('Fetch videos by hashtag error:', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);