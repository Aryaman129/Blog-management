
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      
      login: async (credentials) => {
        try {
          // Convert username to email format for API
          const response = await apiClient.login({
            username: credentials.username,
            password: credentials.password
          });

          if (response.success && response.data) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              token: response.data.token,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (userData) => {
        try {
          const response = await apiClient.register(userData);

          if (response.success && response.data) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              token: response.data.token,
            });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
