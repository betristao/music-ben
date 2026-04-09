let audioCtx: AudioContext | null = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playPianoNote(frequency: number, duration = 2, startTimeOffset = 0) {
  if (!audioCtx) return;

  const startTime = audioCtx.currentTime + startTimeOffset;
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // Mix of triangle and sine for a mellow piano-like tone
  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, startTime);
  osc2.frequency.setValueAtTime(frequency * 2, startTime); // 1st overtone

  // Lowpass filter to remove harsh highs
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, startTime);
  filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

  // Piano envelope (sharp attack, exponential decay)
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.8, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  const osc1Gain = audioCtx.createGain(); osc1Gain.gain.value = 0.7;
  const osc2Gain = audioCtx.createGain(); osc2Gain.gain.value = 0.3;
  
  osc1.connect(osc1Gain); osc2.connect(osc2Gain);
  osc1Gain.connect(filter); osc2Gain.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration);
  osc2.stop(startTime + duration);
}

export function playChord(frequencies: number[], duration = 2) {
  frequencies.forEach(freq => playPianoNote(freq, duration, 0));
}

export function playMelody(frequencies: number[], noteDuration = 0.6) {
  frequencies.forEach((freq, i) => {
    playPianoNote(freq, 1.5, i * noteDuration);
  });
}

export const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  F4_sharp: 369.99, B4_flat: 466.16
};

export function playCorrect() {
  if (!audioCtx) return;
  playPianoNote(NOTES.C5, 0.5, 0);
  playPianoNote(NOTES.E5, 0.5, 0.1);
  playPianoNote(NOTES.G5, 0.5, 0.2);
}

export function playIncorrect() {
  if (!audioCtx) return;
  playPianoNote(NOTES.G3, 0.5, 0);
  playPianoNote(NOTES.C3, 0.5, 0.15);
}
