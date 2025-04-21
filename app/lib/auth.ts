'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './schema';

type AuthUser = Omit<User, 'password'>;

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Mock user database
const MOCK_USERS = [
  { 
    id: 1, 
    username: 'admin', 
    email: 'admin@example.com', 
    password: 'admin123', 
    isAdmin: true 
  },
  { 
    id: 2, 
    username: 'user', 
    email: 'user@example.com', 
    password: 'user123', 
    isAdmin: false 
  }
];

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (username: string, password: string) => {
        // In a real app, this would be an API call
        const user = MOCK_USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword,
            isAuthenticated: true,
            isAdmin: user.isAdmin
          });
          return true;
        }
        
        return false;
      },
      
      register: async (username: string, email: string, password: string) => {
        // Check if username or email already exists
        const exists = MOCK_USERS.some(
          u => u.username === username || u.email === email
        );
        
        if (exists) {
          return false;
        }
        
        // In a real app, this would be an API call
        const newUser = {
          id: MOCK_USERS.length + 1,
          username,
          email,
          password,
          isAdmin: false
        };
        
        MOCK_USERS.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ 
          user: userWithoutPassword,
          isAuthenticated: true,
          isAdmin: false
        });
        
        return true;
      },
      
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);