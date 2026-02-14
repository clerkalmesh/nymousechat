import { create } from "zustand";
import axios from "../lib/axios";

const useAuthStore = create((set, get) => ({
  authUser: null,
  signupData: null,
  isCheckingAuth: true,

  // ✅ SIGNUP (AUTO LOGIN karena backend set JWT)
  signup: async () => {
    try {
      const res = await axios.post("/auth/signup");
      const data = res.data;

      set({
        signupData: {
          _id: data._id,
          secretKey: data.secretKey,
          anonymousId: data.anonymousId,
        },
        authUser: data,
      });

      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // ✅ LOGIN
  login: async (secretKey) => {
    try {
      const res = await axios.post("/auth/login", { secretKey });
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null, signupData: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // ✅ CHECK AUTH (JWT COOKIE)
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res.data });
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ UPDATE PROFILE (displayName / profilePic / dll)
  updateProfile: async (payload) => {
    try {
      const res = await axios.put("/auth/update-profile", payload);
      const updatedUser = res.data;

      const currentSignup = get().signupData;

      set({
        authUser: updatedUser,
        signupData: currentSignup
          ? { ...currentSignup }
          : null,
      });

      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // OPTIONAL kalau mau update displayName doang
  updateDisplayName: async (displayName) => {
    return get().updateProfile({ displayName });
  },

  clearSignupData: () => set({ signupData: null }),
}));

export default useAuthStore;
