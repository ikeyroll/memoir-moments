// Synthesizes soothing acoustic instrumental wedding music using Web Audio API
// Produces real playable WAV data URLs for zero-network-lag, fully licensed music playback

export interface DemoTrack {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  audioDataUrl: string;
  coverImage: string;
}

function createWavDataUrl(durationSeconds: number, chordFrequencies: number[][], tempoBpm: number): string {
  const sampleRate = 22050; // efficient sample rate for smooth web audio
  const numSamples = sampleRate * durationSeconds;
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF Chunk
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");

  // fmt Subchunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample

  // data Subchunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Generate pleasant warm acoustic chords & harp-like plucked arpeggios
  const secondsPerBeat = 60 / tempoBpm;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beatIndex = Math.floor(t / secondsPerBeat);
    const chord = chordFrequencies[beatIndex % chordFrequencies.length];
    const beatPhase = (t % secondsPerBeat) / secondsPerBeat;

    let sampleVal = 0;
    // Layer chord notes with acoustic decay envelope
    chord.forEach((freq, noteIdx) => {
      // Gentle arpeggio offset
      const noteDelay = (noteIdx * 0.15);
      const noteTime = Math.max(0, beatPhase * secondsPerBeat - noteDelay);
      const envelope = Math.exp(-noteTime * 2.5); // plucked string decay

      // Fundamental + gentle warm octave overtone
      const wave = Math.sin(2 * Math.PI * freq * t) * 0.6 + Math.sin(2 * Math.PI * (freq * 2) * t) * 0.25;
      sampleVal += wave * envelope;
    });

    // Master fade in / out
    const fadeIn = Math.min(1, t / 0.8);
    const fadeOut = Math.min(1, (durationSeconds - t) / 1.0);
    sampleVal = sampleVal * 0.25 * fadeIn * fadeOut;

    // Clamp to 16-bit PCM
    const clamped = Math.max(-1, Math.min(1, sampleVal));
    const intSample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
    view.setInt16(44 + i * 2, intSample, true);
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

let cachedTracks: DemoTrack[] | null = null;

export function getBundledWeddingTracks(): DemoTrack[] {
  if (cachedTracks) return cachedTracks;

  if (typeof window === "undefined") {
    return [
      {
        id: "track_1",
        title: "Golden Hour",
        artist: "Memoir Studio",
        durationSeconds: 24,
        audioDataUrl: "",
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "track_2",
        title: "Always With You",
        artist: "Memoir Studio",
        durationSeconds: 20,
        audioDataUrl: "",
        coverImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "track_3",
        title: "Softly",
        artist: "Memoir Studio",
        durationSeconds: 22,
        audioDataUrl: "",
        coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "track_4",
        title: "Our Beginning",
        artist: "Memoir Studio",
        durationSeconds: 25,
        audioDataUrl: "",
        coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80",
      },
    ];
  }

  // Chords: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
  const track1Url = createWavDataUrl(24, [[261.63, 329.63, 392.0, 493.88], [220.0, 261.63, 329.63, 392.0], [174.61, 220.0, 261.63, 329.63], [196.0, 261.63, 293.66, 392.0]], 72);
  // Chords: Dmaj -> F#m -> Gmaj7 -> A
  const track2Url = createWavDataUrl(20, [[293.66, 369.99, 440.0], [185.0, 277.18, 369.99], [196.0, 246.94, 293.66, 369.99], [220.0, 277.18, 329.63, 440.0]], 68);
  // Chords: Gmaj -> Em -> Cmaj7 -> D
  const track3Url = createWavDataUrl(22, [[196.0, 246.94, 293.66], [164.81, 196.0, 246.94], [130.81, 196.0, 246.94, 329.63], [146.83, 220.0, 293.66]], 64);
  // Chords: Emaj -> G#m -> A -> B
  const track4Url = createWavDataUrl(25, [[164.81, 207.65, 246.94], [207.65, 246.94, 311.13], [220.0, 277.18, 329.63], [246.94, 311.13, 369.99]], 75);

  cachedTracks = [
    {
      id: "track_1",
      title: "Golden Hour",
      artist: "Memoir Studio",
      durationSeconds: 24,
      audioDataUrl: track1Url,
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "track_2",
      title: "Always With You",
      artist: "Memoir Studio",
      durationSeconds: 20,
      audioDataUrl: track2Url,
      coverImage: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "track_3",
      title: "Softly",
      artist: "Memoir Studio",
      durationSeconds: 22,
      audioDataUrl: track3Url,
      coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "track_4",
      title: "Our Beginning",
      artist: "Memoir Studio",
      durationSeconds: 25,
      audioDataUrl: track4Url,
      coverImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return cachedTracks;
}

