import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';
import { supabase } from '@/utils/supabase';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, username: string, role: 'user' | 'business') => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          // In a real app with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Get user profile from the database
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) throw profileError;

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              username: profileData.username,
              displayName: profileData.display_name,
              avatar: profileData.avatar_url,
              bio: profileData.bio,
              role: profileData.role,
              verified: profileData.verified,
            };

            set({ currentUser: user, isAuthenticated: true, isLoading: false });
          }
        } catch (error: any) {
          console.error('Login error: ', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });

          // This would use the Google auth utility
          // For now, we'll simulate with mock data

          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user: User = {
            id: 'google-user1',
            email: 'google-user@example.com',
            username: 'googleuser',
            displayName: 'Google User',
            avatar: 'https://images.unsplash.com/photo-1535713875881-d1d8cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=158&q=80',
            bio: 'Signed in with Google',
            role: 'user',
            verified: true,
          };

          set({ currentUser: user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          console.error('Google login error: ', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      register: async (email: string, password: string, username: string, role: 'user' | 'business') => {
        try {
          set({ isLoading: true, error: null });

          // In a real app with Supabase
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Create user profile in the database
            const { error: profileError } = await supabase
              .from('users')
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  username,
                  displayName: username,
                  avatar_url: 'https://images.unsplash.com/photo-1535713875881-d1d8cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=158&q=80',
                  bio: '',
                  role,
                  verified: false,
                },
              ]);

            if (profileError) throw profileError;

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              username,
              displayName: username,
              avatar:
                'https://images.unsplash.com/photo-1535713875881-d1d8cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=158&q=80',
              bio: '',
              role,
              verified: false,
            };

            set({ currentUser: user, isAuthenticated: true, isLoading: false });
          }
        } catch (error: any) {
          console.error('Registration error: ', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });

          // In a real app with Supabase
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({ currentUser: null, isAuthenticated: false, isLoading: false });
        } catch (error: any) {
          console.error('Logout error: ', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      updateProfile: async (userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });

          const currentUser = get().currentUser;
          if (!currentUser) throw new Error('No user logged in');

          // In a real app with Supabase
          const { error } = await supabase
            .from('users')
            .update({
              display_name: userData.displayName,
              avatar_url: userData.avatar,
              bio: userData.bio,
              // Don't update username or role here for security
            })
            .eq('id', currentUser.id);

          if (error) throw error;

          set((state) => ({
            currentUser: state.currentUser ? { ...state.currentUser, ...userData } : null,
            isLoading: false,
          }));
        } catch (error: any) {
          console.error('Profile update error: ', error.message);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      refreshUser: async () => {
        try {
          set({ isLoading: true, error: null });

          // In a real app with Supabase
          const { data: user, error } = await supabase.auth.getUser();

          if (error) throw error;

          if (user) {
            // Get user profile from the database
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.user.id)
              .single();

            if (profileError) throw profileError;

            const updatedUser: User = {
              id: user.user.id,
              email: user.user.email || '',
              username: profileData.username,
              displayName: profileData.display_name,
              avatar: profileData.avatar_url,
              bio: profileData.bio,
              role: profileData.role,
              verified: profileData.verified,
            };

            set({ currentUser: updatedUser, isAuthenticated: true, isLoading: false });
          } else {
            set({ currentUser: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error: any) {
          console.error('Refresh user error: ', error.message);
          set({ error: error.message, isLoading: false });
          // Don't throw here to prevent app crashes on refresh
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist the these fields
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);