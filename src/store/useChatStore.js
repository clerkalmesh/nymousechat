import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  globalMessages: [],
  isGlobalLoading: false,

  // Private chat
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil daftar user");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil pesan");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim pesan");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      }
    };
    socket.on("newMessage", handleNewMessage);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser}) ),

  // Global chat
  getGlobalMessages: async () => {
    set({ isGlobalLoading: true });
    try {
      const res = await axiosInstance.get("/global/get");
      set({ globalMessages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil pesan global");
    } finally {
      set({ isGlobalLoading: false });
    }
  },

  sendGlobalMessage: async (messageData) => {
    try {
      const res = await axiosInstance.post("/global/send", messageData);
      set((state) => ({ globalMessages: [...state.globalMessages, res.data] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim pesan global");
      throw error;
    }
  },

  subscribeToGlobal: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newGlobalMessage", (newMessage) => {
      set((state) => ({ globalMessages: [...state.globalMessages, newMessage] }));
    });
  },

  unsubscribeFromGlobal: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newGlobalMessage");
  },
}));
