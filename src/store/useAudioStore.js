import { create } from "zustand";

export const useAudioStore = create((set, get) => ({
  audio: null,
  isPlaying: false,
  isMuted: true,
  volume: 0.5,
  hasUserInteracted: false, // menandai apakah user pernah mengubah mute

  initAudio: (src) => {
    if (get().audio) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = true;

    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("volumechange", () => {
      set({ isMuted: audio.muted });
    });

    set({ audio });
  },

  play: () => {
    const { audio, hasUserInteracted, isMuted } = get();
    if (audio) {
      // Jika pertama kali play dan masih mute, unmute otomatis agar bersuara
      if (!hasUserInteracted && isMuted) {
        audio.muted = false;
        set({ isMuted: false, hasUserInteracted: true });
      }
      audio.play().catch((e) => console.log("Play gagal", e));
    }
  },

  pause: () => {
    const { audio } = get();
    if (audio) audio.pause();
  },

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) get().pause();
    else get().play();
  },

  toggleMute: () => {
    const { audio, isMuted } = get();
    if (audio) {
      audio.muted = !isMuted;
      set({ isMuted: !isMuted, hasUserInteracted: true });
    }
  },

  stop: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      set({ isPlaying: false });
    }
  },

  setVolume: (vol) => {
    const { audio } = get();
    if (audio) {
      audio.volume = vol;
      set({ volume: vol });
    }
  },
}));
