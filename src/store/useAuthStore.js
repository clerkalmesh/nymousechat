import { create } from "zustand";
import axios from "../lib/axios";

const useAuthStore = create((set, get) => ({
  authUser: null,
  signupData: null,
  isCheckingAuth: true,

  // ✅ SIGNUP = AUTO LOGIN (backend set JWT)
  signup: async () => {
    try {
      const res = await axios.post("/auth/signup");
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
      const res = await axios.post("/auth/login", { secretKey });
      set({ authUser: res.data });
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null, signupData: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

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

  updateDisplayName: async (displayName) => {
    try {
      const res = await axios.put("/auth/update-profile", { displayName });

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
