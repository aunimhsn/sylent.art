// The sound of the variant « L'impact », synthesized from its cues rather than taken from a
// track, so that every hit falls on its frame and no music rights are involved. Plain
// JavaScript without dependencies: the page plays it, render.mjs writes it into the MP4.

export const RATE = 48000;

/** A deterministic white noise, so that every render sounds the same. */
function noise(seed) {
  let state = seed * 2654435761 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296) * 2 - 1;
  };
}

/** A one-pole low-pass filter of a noise, its cutoff in hertz. */
function lowPass(source) {
  let value = 0;
  return (cutoff) => {
    const amount = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
    value += amount * (source() - value);
    return value;
  };
}

/**
 * The samples of the cues, mono, at RATE.
 * @param {{ time: number, sound: string, pitch?: number, gain?: number, length?: number }[]} cues
 * @param {number} duration in seconds
 */
export function synthesize(cues, duration) {
  const out = new Float32Array(Math.ceil(duration * RATE));
  const cuts = cues
    .filter((cue) => cue.sound === "cut")
    .map((cue) => cue.time);
  /** Adds a sound from `start`, `length` seconds long, cut short by the next cut. */
  const add = (start, length, sample) => {
    const cut = cuts.find((time) => time > start) ?? Infinity;
    const end = Math.min(start + length, cut);
    const fade = 0.012;
    const first = Math.max(0, Math.round(start * RATE));
    const last = Math.min(out.length, Math.round(end * RATE));
    for (let index = first; index < last; index++) {
      const time = index / RATE;
      const tail = Math.min(1, (end - time) / fade);
      out[index] += sample(time - start) * tail;
    }
  };

  cues.forEach((cue, order) => {
    const gain = cue.gain ?? 1;
    const pitch = cue.pitch ?? 1;
    const random = noise(order + 1);
    switch (cue.sound) {
      // A rising hiss and tone, up to the first hit.
      case "riser": {
        const length = cue.length ?? 1;
        const filter = lowPass(random);
        add(cue.time, length, (x) => {
          const rise = (x / length) ** 2;
          const phase = 2 * Math.PI * (180 * x + (520 * x * x) / (2 * length));
          return (
            gain *
            rise *
            (0.35 * filter(300 + 5000 * rise) + 0.12 * Math.sin(phase))
          );
        });
        break;
      }
      // A text that falls: a short whoosh, then a deep boom, a thud and a click.
      case "impact": {
        const whoosh = lowPass(random);
        add(cue.time - 0.2, 0.2, (x) => {
          const rise = (x / 0.2) ** 2;
          return gain * 0.45 * rise * whoosh(800 + 6000 * rise);
        });
        const click = lowPass(random);
        add(cue.time, 1.8, (x) => {
          const sweep =
            2 * Math.PI * (42 * pitch * x + (95 * pitch * (1 - Math.exp(-18 * x))) / 18);
          const boom = Math.sin(sweep) * Math.exp(-2.6 * x);
          const thud =
            Math.sin(2 * Math.PI * 118 * pitch * x) * Math.exp(-22 * x);
          const crack = click(4000) * Math.exp(-70 * x);
          return gain * (0.95 * boom + 0.5 * thud + 0.9 * crack);
        });
        break;
      }
      // A soft xylophone note, for a letter that pops up.
      case "pluck": {
        const frequency = 523.25 * pitch;
        add(cue.time, 0.7, (x) => {
          const attack = Math.min(1, x / 0.004);
          const tone =
            Math.sin(2 * Math.PI * frequency * x) +
            0.25 * Math.sin(2 * Math.PI * 4 * frequency * x) * Math.exp(-14 * x);
          return gain * 0.22 * attack * tone * Math.exp(-7 * x);
        });
        break;
      }
      // The bounce of the orange ball: a little rising boop.
      case "boop": {
        const frequency = 440 * pitch;
        add(cue.time, 0.35, (x) => {
          const glide = frequency * (0.75 + 0.25 * Math.min(1, x / 0.04));
          return (
            gain *
            0.3 *
            Math.sin(2 * Math.PI * glide * x) *
            Math.min(1, x / 0.003) *
            Math.exp(-11 * x)
          );
        });
        break;
      }
      // The ball lands on its letter: a bell and a few sparkles.
      case "chime": {
        const frequency = 1568 * pitch;
        add(cue.time, 2.5, (x) => {
          const attack = Math.min(1, x / 0.003);
          const bell =
            Math.sin(2 * Math.PI * frequency * x) * Math.exp(-2.4 * x) +
            0.4 * Math.sin(2 * Math.PI * 2.76 * frequency * x) * Math.exp(-5 * x) +
            0.15 * Math.sin(2 * Math.PI * 5.4 * frequency * x) * Math.exp(-9 * x);
          return gain * 0.2 * attack * bell;
        });
        [2093, 2637, 3136].forEach((sparkle, index) =>
          add(cue.time + 0.07 * (index + 1), 0.6, (x) =>
            gain *
            0.06 *
            Math.sin(2 * Math.PI * sparkle * x) *
            Math.min(1, x / 0.003) *
            Math.exp(-9 * x),
          ),
        );
        break;
      }
    }
  });

  // A soft clip, then the peak at -1 dB.
  let peak = 0;
  for (let index = 0; index < out.length; index++) {
    out[index] = Math.tanh(1.3 * out[index]);
    peak = Math.max(peak, Math.abs(out[index]));
  }
  if (peak > 0) {
    const scale = 0.89 / peak;
    for (let index = 0; index < out.length; index++) out[index] *= scale;
  }
  return out;
}
