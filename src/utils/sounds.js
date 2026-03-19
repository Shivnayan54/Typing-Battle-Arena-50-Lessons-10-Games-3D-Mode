// TypeNova Sound Effects using Web Audio API
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.3;
  }

  getContext() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  playTone(frequency, duration, type = 'sine', volumeScale = 1) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, ctx.currentTime + duration);

      gainNode.gain.setValueAtTime(this.volume * volumeScale, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch { /* silent fail */ }
  }

  keyPress() {
    // Subtle soft click
    this.playTone(800, 0.04, 'triangle', 0.4);
  }

  keyError() {
    // Low buzz for error
    this.playTone(180, 0.08, 'sawtooth', 0.5);
  }

  keyCorrectStreak() {
    // Pleasant high tick for good typing rhythm
    this.playTone(1200, 0.03, 'sine', 0.25);
  }

  testComplete() {
    // Victory fanfare
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.5), i * 80);
    });
  }

  streakMilestone() {
    // Ascending chime
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'triangle', 0.4), i * 60);
    });
  }

  levelUp() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'sine', 0.6), i * 100);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(val) {
    this.enabled = val;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
  }
}

export const sounds = new SoundEngine();
