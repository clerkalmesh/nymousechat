class AudioManager {
  sounds = {};
  currentBgm = null;
  unlocked = false;

  constructor() {
    const unlock = () => {
      if (this.unlocked) return;

      this.unlocked = true;
      console.log("🔓 Audio unlocked by user interaction");

      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };

    // Mobile butuh gesture
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("click", unlock);
  }

  load(name, src, volume = 1) {
    if (this.sounds[name]) return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = "auto";

    this.sounds[name] = audio;
  }

  play(name) {
    if (!this.unlocked) return;

    const audio = this.sounds[name];
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  playBgm(name) {
    if (!this.unlocked) return;
    if (this.currentBgm === name) return;

    this.stopBgm();

    const audio = this.sounds[name];
    if (!audio) return;

    audio.loop = true;
    audio.currentTime = 0;
    audio.play().catch(() => {});

    this.currentBgm = name;
  }

  stopBgm() {
    if (!this.currentBgm) return;

    const audio = this.sounds[this.currentBgm];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = false;
    }

    this.currentBgm = null;
  }
}

export const audioManager = new AudioManager();
