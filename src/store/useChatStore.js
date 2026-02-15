// frontend/src/store/useChatStore.js
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

  // Ambil daftar user untuk sidebar (kecuali diri sendiri)
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

  // Ambil riwayat pesan dengan user tertentu
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

  // Kirim pesan baru (via HTTP) dan tambahkan ke state lokal
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

  // Berlangganan event pesan baru dari socket (hanya dari lawan bicara yang sedang dipilih)
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket belum tersedia");
      return;
    }

    const handleNewMessage = (newMessage) => {
      // Hanya proses jika pesan berasal dari user yang sedang dipilih
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    };

    socket.on("newMessage", handleNewMessage);

    // Simpan handler untuk cleanup jika perlu (opsional)
    // Kita bisa mengembalikan fungsi unsubscribe, tapi kita sudah punya method terpisah
  },

  // Berhenti berlangganan event pesan baru
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  // Pilih user untuk chat
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    // Reset pesan ketika berganti user (opsional)
    //set({ messages: [] });
  },
}));