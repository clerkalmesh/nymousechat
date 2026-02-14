import { create } from 'zustand';
import axios from '../lib/axios';

const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  signupData: null,

  signup: async () => {
    try {
      const res = await axios.post('/auth/signup');
      const data = res.data;
      set({
        signupData: { secretKey: data.secretKey, anonymousId: data.anonymousId },
        authUser: { _id: data._id, anonymousId: data.anonymousId, displayName: data.displayName }
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  login: async (secretKey) => {
    try {
      const res = await axios.post('/auth/login', { secretKey });
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
      set({ authUser: null, signupData: null });
    } catch (error) {
      console.error(error);
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
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  clearSignupData: () => set({ signupData: null }),
}));

export default useAuthStore;