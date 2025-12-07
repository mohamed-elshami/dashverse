/**
 * Game sound effects using Web Audio API
 */

class GameSoundManager {
  private audioContext: AudioContext | null = null;
  private soundsEnabled: boolean = true;

  constructor() {
    // Initialize audio context on user interaction (browser requirement)
    if (typeof window !== 'undefined') {
      this.audioContext = null; // Will be initialized on first play
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Generate a beep sound
   */
  private beep(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.soundsEnabled) return;

    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  /**
   * Play eating sound (successful food collection)
   */
  playEatSound(): void {
    // Play a pleasant ascending tone
    this.beep(440, 0.1, 'sine');
    setTimeout(() => {
      this.beep(554, 0.1, 'sine');
    }, 50);
  }

  /**
   * Play game over sound (collision/lose)
   */
  playGameOverSound(): void {
    // Play a descending tone sequence
    this.beep(330, 0.15, 'sine');
    setTimeout(() => {
      this.beep(262, 0.2, 'sine');
    }, 100);
    setTimeout(() => {
      this.beep(196, 0.3, 'square');
    }, 200);
  }

  /**
   * Toggle sounds on/off
   */
  toggleSounds(enabled: boolean): void {
    this.soundsEnabled = enabled;
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.soundsEnabled;
  }
}

// Export singleton instance
export const gameSounds = new GameSoundManager();

