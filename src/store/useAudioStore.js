import { create } from "zustand";

export const useAudioStore = create((set, get) => ({
  audio: null,
  isPlaying: false,
  isMuted: true, // default mute agar autoplay diizinkan
  volume: 0.5,

  initAudio: (src) => {
    if (get().audio) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.muted = true; // mute untuk autoplay

    audio.addEventListener("play", () => set({ isPlaying: true }));
    audio.addEventListener("pause", () => set({ isPlaying: false }));
    audio.addEventListener("volumechange", () => {
      set({ isMuted: audio.muted });
    });

    set({ audio });
  },

  play: () => {
    const { audio } = get();
    if (audio) {
      audio.play().catch((e) => console.log("Play error", e));
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
      set({ isMuted: !isMuted });
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
