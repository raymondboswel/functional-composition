export interface Note {
  frequency?: number;
  pitchNames: string[];
  octave: number;
  normalizedDuration?: number; // A number constrained to 1/8, 1/4, 1/2, 1/3, 1, 2, etc.
}
