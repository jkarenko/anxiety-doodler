/**
 * SoundEffectsPlayer.ts
 * 
 * A utility for loading and playing sound effects in the application.
 * Provides functions for different sound effects that animations can import and play.
 */

// Map to store loaded audio elements
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Default sound file paths
const SOUND_PATHS = {
  // Impact sounds
  hammerImpact: './sounds/hammer-impact.mp3',
  softImpact: './sounds/soft-impact.mp3',
  hardImpact: './sounds/hard-impact.mp3',

  // Movement sounds
  whoosh: './sounds/whoosh.mp3',
  swipe: './sounds/swipe.mp3',

  // Explosion sounds
  explosion: './sounds/explosion.mp3',
  smallExplosion: './sounds/small-explosion.mp3',

  // Fire sounds
  fire: './sounds/fire.mp3',
  burn: './sounds/burn.mp3',

  // Misc sounds
  pop: './sounds/pop.mp3',
  bounce: './sounds/bounce.mp3',
  crumble: './sounds/crumble.mp3'
};

// Global volume control (0.0 to 1.0)
let globalVolume = 0.7;
let muted = false;

/**
 * Preload a sound file into the audio cache
 * @param key - The identifier for the sound
 * @param path - The path to the sound file
 */
export function preloadSound(key: string, path: string): void {
  if (!audioCache.has(key)) {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audioCache.set(key, audio);

    // Load the audio file
    audio.load();
  }
}

/**
 * Preload all default sounds
 */
export function preloadAllSounds(): void {
  Object.entries(SOUND_PATHS).forEach(([key, path]) => {
    preloadSound(key, path);
  });
}

/**
 * Play a sound effect
 * @param key - The identifier for the sound to play
 * @param volume - Optional volume override (0.0 to 1.0)
 * @param loop - Whether the sound should loop
 * @returns The audio element that's playing, or undefined if the sound couldn't be played
 */
export function playSound(key: string, volume?: number, loop: boolean = false): HTMLAudioElement | undefined {
  if (muted) return undefined;

  // If the sound isn't cached, try to load it
  if (!audioCache.has(key) && key in SOUND_PATHS) {
    preloadSound(key, SOUND_PATHS[key as keyof typeof SOUND_PATHS]);
  }

  const audio = audioCache.get(key);
  if (audio) {
    // Clone the audio to allow overlapping sounds
    const soundInstance = new Audio(audio.src);
    soundInstance.volume = volume !== undefined ? volume : globalVolume;
    soundInstance.loop = loop;

    // Play the sound asynchronously to avoid blocking the main thread
    setTimeout(() => {
      soundInstance.play().catch(error => {
        console.error(`Error playing sound "${key}":`, error);
      });
    }, 0);

    return soundInstance;
  }

  console.warn(`Sound "${key}" not found in audio cache`);
  return undefined;
}

/**
 * Stop a currently playing sound
 * @param audio - The audio element to stop
 */
export function stopSound(audio: HTMLAudioElement): void {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

/**
 * Set the global volume for all sounds
 * @param volume - Volume level (0.0 to 1.0)
 */
export function setVolume(volume: number): void {
  globalVolume = Math.max(0, Math.min(1, volume));
}

/**
 * Mute or unmute all sounds
 * @param isMuted - Whether sounds should be muted
 */
export function setMuted(isMuted: boolean): void {
  muted = isMuted;
}

/**
 * Check if sounds are currently muted
 * @returns Whether sounds are muted
 */
export function isMuted(): boolean {
  return muted;
}

// Convenience functions for specific sound effects

/**
 * Play a hammer impact sound
 * @param volume - Optional volume override
 */
export function playHammerImpact(volume?: number): HTMLAudioElement | undefined {
  return playSound('hammerImpact', volume);
}

// Define a sample with start time and duration
interface SoundSample {
  start: number;
  duration: number;
}

const WHOOSH_SAMPLES: SoundSample[] = [
  { start: 0, duration: 0.5 },
  { start: 0.5, duration: 0.5 },
  { start: 1.0, duration: 0.5 },
  { start: 1.5, duration: 0.5 }
];

const CRUMBLE_SAMPLES: SoundSample[] = [] = [
    { start: 0, duration: 1.0 },
    { start: 1.0, duration: 1.0 },
    { start: 2.0, duration: 1.0 },
    { start: 3.0, duration: 1.0 }
];



/**
 * Play a random sample from a sound file
 * @param key - The identifier for the sound to play
 * @param samples - Array of samples with start times and durations
 * @param volume - Optional volume override (0.0 to 1.0)
 * @returns The audio element that's playing, or undefined if the sound couldn't be played
 */
export function playSoundSample(
  key: string, 
  samples: SoundSample[], 
  volume?: number
): HTMLAudioElement | undefined {
  if (muted) return undefined;

  // If the sound isn't cached, try to load it
  if (!audioCache.has(key) && key in SOUND_PATHS) {
    preloadSound(key, SOUND_PATHS[key as keyof typeof SOUND_PATHS]);
  }

  const audio = audioCache.get(key);
  if (audio) {
    // Clone the audio to allow overlapping sounds
    const soundInstance = new Audio(audio.src);
    soundInstance.volume = volume !== undefined ? volume : globalVolume;

    // Select a random sample
    const randomSample = samples[Math.floor(Math.random() * samples.length)];

    // Set the start time to play only the selected sample
    soundInstance.currentTime = randomSample.start;

    // Play the sound asynchronously to avoid blocking the main thread
    setTimeout(() => {
      soundInstance.play().catch(error => {
        console.error(`Error playing sound "${key}":`, error);
      });

      // Stop the sound after the sample duration
      setTimeout(() => {
        stopSound(soundInstance);
      }, randomSample.duration * 1000);
    }, 0);

    return soundInstance;
  }

  console.warn(`Sound "${key}" not found in audio cache`);
  return undefined;
}

/**
 * Play a random whoosh sound sample from the whoosh.mp3 file
 * @param volume - Optional volume override
 */
export function playWhoosh(volume?: number): HTMLAudioElement | undefined {
  return playSoundSample('whoosh', WHOOSH_SAMPLES, volume);
}

/**
 * Play an explosion sound
 * @param small - Whether to play a small explosion sound
 * @param volume - Optional volume override
 */
export function playExplosion(small: boolean = false, volume?: number): HTMLAudioElement | undefined {
  return playSound(small ? 'smallExplosion' : 'explosion', volume);
}

/**
 * Play a fire or burning sound
 * @param continuous - Whether to play the continuous fire sound (true) or the shorter burn sound (false)
 * @param volume - Optional volume override
 */
export function playFireSound(continuous: boolean = false, volume?: number): HTMLAudioElement | undefined {
  return playSound(continuous ? 'fire' : 'burn', volume, continuous);
}

/**
 * Play a crumbling sound (for breaking objects)
 * @param volume - Optional volume override
 */
export function playCrumble(volume?: number): HTMLAudioElement | undefined {
  return playSoundSample('crumble', CRUMBLE_SAMPLES, volume);
}

/**
 * Play a pop sound
 * @param volume - Optional volume override
 */
export function playPop(volume?: number): HTMLAudioElement | undefined {
  return playSound('pop', volume);
}

/**
 * Play a bounce sound
 * @param volume - Optional volume override
 */
export function playBounce(volume?: number): HTMLAudioElement | undefined {
  return playSound('bounce', volume);
}
