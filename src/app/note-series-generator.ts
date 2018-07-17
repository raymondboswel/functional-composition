import { Note } from "./app.component";

export function generateNotesSeries(
  referenceAFrequency = 440,
  n: number
): Note[] {
  const referenceA = { frequency: 440, pitchNames: ["A"], index: 0, octave: 4 };
  return removeDuplicates(
    generateLowerRange(440, n).concat(generateUpperRange(referenceA, n))
  );
}

function removeDuplicates(arr: Note[]) {
  if (arr.length == 0) {
    return [];
  }
  return [arr[0]].concat(
    removeDuplicates(arr.filter(n => n.frequency != arr[0].frequency))
  );
}

function generateUpperRange(currentNote: Note, n, series = []): Note[] {
  if (n == 0) {
    return series;
  }
  series.push(currentNote);
  return generateUpperRange(
    {
      frequency: currentNote.frequency,
      pitchNames: addSemiToneToPitchName(currentNote.pitchNames),
      index: currentNote.index + 1,
      octave: 4
    },
    n - 1,
    series
  );
}

function addSemiToneToPitchName(pitchNames: string[]): string[] {}

function generateLowerRange(currentFrequency, n, series = []): Note[] {
  if (n == 0) {
    return series;
  }
  series.push({ frequency: currentFrequency, index: n });
  return generateLowerRange(
    currentFrequency * Math.pow(2, -1 / 12),
    n - 1,
    series
  ).reverse();
}

const pitchValues = {
  A: 0,
  "A#": 1,
  Bb: 1,
  B: 2,
  Cb: 2,
  "B#": 3,
  C: 3
};
