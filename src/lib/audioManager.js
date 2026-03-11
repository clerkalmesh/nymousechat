class AudioManager {
  sounds = {};
  currentBgm = null;

  load(name, src, volume = 1) {
    if (this.sounds[name]) return;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.preload = "auto";

    this.sounds[name] = audio;
  }

  play(name) {
    const audio = this.sounds[name];
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  playBgm(name) {
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