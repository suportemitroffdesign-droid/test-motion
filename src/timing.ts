import cues from '../scripts/audio-cues.json';
// Single cue sheet for the visuals and procedural soundtrack.
export const timing = {...cues, duration: cues.duration_frames, beatFrames: 60 / cues.bpm * cues.fps};
