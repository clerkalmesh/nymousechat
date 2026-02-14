// frontend/src/store/useAuthStore.js
import { create } from 'zustand';
import axios from '../lib/axios';

const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  signupData: null, // menyimpan secretKey dan anonymousId sementara

  // Signup: request ke backend
  signup: async () => {
    try {
      const res = await axios.post('/auth/signup');
      const data = res.data;
      set({
        signupData: {
          secretKey: data.secretKey,
          anonymousId: data.anonymousId
        },
        authUser: {
          _id: data._id,
          anonymousId: data.anonymousId,
          displayName: data.displayName
        }
      });
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // lempar error agar bisa ditangani di komponen
    }
  },

  login: async (secretKey) => {
    try {
      const res = await axios.post('/auth/login', { secretKey });
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
      set({ authUser: null, signupData: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateDisplayName: async (displayName) => {
    try {
      const res = await axios.put('/auth/update-profile', { displayName });
      // perbarui authUser dengan displayName baru
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error('Update display name error:', error);
      throw error;
    }
  },

  clearSignupData: () => set({ signupData: null }),
}));

export default useAuthStore;