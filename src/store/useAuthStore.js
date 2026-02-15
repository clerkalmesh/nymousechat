// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const useAuthStore = create((set, get) => ({
  authUser: null,
  signupData: null,          // menyimpan secretKey & anonymousId sementara
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  // ========== AUTHENTICATION ==========

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // hubungkan socket setelah auth
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup tanpa input (backend generate secret key)
  signup: async () => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup");
      const data = res.data;

      set({
        signupData: {
          secretKey: data.secretKey,
          anonymousId: data.anonymousId,
        },
        authUser: {
          _id: data._id,
          anonymousId: data.anonymousId,
          displayName: data.displayName,
        },
      });

      toast.success("Identitas berhasil dibuat!");
      get().connectSocket();
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Gagal membuat identitas");
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login dengan secretKey
  login: async (secretKey) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", { secretKey });
      set({ authUser: res.data });
      toast.success("Login berhasil!");
      get().connectSocket();
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Secret key tidak valid");
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, signupData: null });
      get().disconnectSocket();
      toast.success("Logout berhasil");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Gagal logout");
    }
  },

  updateDisplayName: async (displayName) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", { displayName });

      // Update juga signupData jika ada
      const currentSignup = get().signupData;
      set({
        authUser: res.data,
        signupData: currentSignup
          ? { ...currentSignup, displayName: res.data.displayName }
          : null,
      });

      toast.success("Display name diperbarui");
      return res.data;
    } catch (error) {
      console.error("Update display name error:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui nama");
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  clearSignupData: () => set({ signupData: null }),

  // ========== SOCKET.IO (AMAN) ==========

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    // Gunakan withCredentials agar cookie JWT terkirim otomatis
    const newSocket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"], // opsional, untuk performa
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    newSocket.on("error", (err) => {
      console.error("❌ Socket error:", err);
      toast.error("Koneksi real-time terputus");
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));

export default useAuthStore;


/* work version
mport { create } from "zustand";
import axiosInstance from "../lib/axios";

const useAuthStore = create((set, get) => ({
  authUser: null,
  signupData: null,
  isCheckingAuth: true,

  // ✅ SIGNUP = AUTO LOGIN (backend set JWT)
  signup: async () => {
    try {
      const res = await axiosInstance.post("/auth/signup");
      const data = res.data;

      set({
        signupData: {
          _id: data._id,
          secretKey: data.secretKey,
          anonymousId: data.anonymousId,
          displayName: data.displayName,
        },
        authUser: data, // ← karena JWT sudah diset
      });

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  login: async (secretKey) => {
    try {
      const res = await axiosInstance.post("/auth/login", { secretKey });
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, signupData: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateDisplayName: async (displayName) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", { displayName });

      const currentSignup = get().signupData;

      set({
        authUser: res.data,
        signupData: currentSignup
          ? { ...currentSignup, displayName: res.data.displayName }
          : null,
      });

      return res.data;
    } catch (error) {
      console.error("Update display name error:", error);
      throw error;
    }
  },

  clearSignupData: () => set({ signupData: null }),
}));

export default useAuthStore;
*/



/* frontend/src/store/useAuthStore.js
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
*/