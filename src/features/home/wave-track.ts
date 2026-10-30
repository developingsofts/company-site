const MID = 260;
const HALF_WAVE = 600;

/**
 * A gentle wave across the TextLoop canvas's middle, one full wave per canvas
 * width, from half wave `from` to half wave `to` (half wave 0 starts at the
 * canvas's left edge). Crests alternate by absolute index, so tracks with
 * different ends still line up, and a negative `amplitude` mirrors the wave
 * so the two meet at every half wave. `amplitude` is the height of the control
 * points; the crests sit half that far from the middle.
 */
export function waveTrack(amplitude: number, from: number, to: number) {
  const start = from * HALF_WAVE;
  const lift = from % 2 === 0 ? amplitude : -amplitude;
  const parts = [`M ${start} ${MID}`, `Q ${start + HALF_WAVE / 2} ${MID - lift} ${start + HALF_WAVE} ${MID}`];
  for (let i = from + 2; i <= to; i++) parts.push(`T ${i * HALF_WAVE} ${MID}`);
  return parts.join(" ");
}
