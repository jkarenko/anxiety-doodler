import { SoundEffectsPlayer, SoundSample } from 'sfx-player';

const SOUND_PATHS = {
  hammerImpact: './sounds/hammer-impact.mp3',
  whoosh: './sounds/whoosh.mp3',
  explosion: './sounds/explosion.mp3',
  smallExplosion: './sounds/small-explosion.mp3',
  fire: './sounds/fire.mp3',
  burn: './sounds/burn.mp3',
  pop: './sounds/pop.mp3',
  crumble: './sounds/crumble.mp3'
};

const player = new SoundEffectsPlayer(SOUND_PATHS);

const WHOOSH_SAMPLES: SoundSample[] = [
  { start: 0, duration: 0.5 },
  { start: 0.5, duration: 0.5 },
  { start: 1.0, duration: 0.5 },
  { start: 1.5, duration: 0.5 }
];

const CRUMBLE_SAMPLES: SoundSample[] = [
  { start: 0, duration: 1.0 },
  { start: 1.0, duration: 1.0 },
  { start: 2.0, duration: 1.0 },
  { start: 3.0, duration: 1.0 }
];

player.registerSamples('whoosh', WHOOSH_SAMPLES);
player.registerSamples('crumble', CRUMBLE_SAMPLES);

player.preloadAllSounds();

export function playHammerImpact(volume?: number): HTMLAudioElement | undefined {
  return player.playSound('hammerImpact', volume, false, 0.03);
}

export function playWhoosh(volume?: number): HTMLAudioElement | undefined {
  return player.playSoundSample('whoosh', WHOOSH_SAMPLES, volume);
}

export function playExplosion(small: boolean = false, volume?: number): HTMLAudioElement | undefined {
  return player.playSound(small ? 'smallExplosion' : 'explosion', volume, false, 0.05);
}

export function playCrumble(volume?: number): HTMLAudioElement | undefined {
  return player.playSoundSample('crumble', CRUMBLE_SAMPLES, volume);
}

export function playPop(volume?: number): HTMLAudioElement | undefined {
  return player.playSound('pop', volume);
}
