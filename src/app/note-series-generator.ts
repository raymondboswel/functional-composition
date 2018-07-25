import { Note } from "./app.component";

export function generateNotesSeries(
  n: number,
  referenceAFrequency = 440
): Note[] {
  const referenceA = {
    frequency: 440,
    pitchNames: ["A"],
    index: 0,
    octave: 4,
    normalizedDuration: 0,
    normalizedStart: 0
  };
  return removeDuplicates(
    generateLowerRange(referenceA, n).concat(generateUpperRange(referenceA, n))
  );
}

function setOctave(note: Note) {
  return { ...note, octave: getOctave(note.frequency) };
}

export function getOctave(frequency: number) {
  if (between(frequency, 3520, 7040)) {
    return 6;
  }
  if (between(frequency, 1760, 3520)) {
    return 6;
  }
  if (between(frequency, 880, 1760)) {
    return 5;
  }
  if (between(frequency, 440, 880)) {
    return 4;
  }
  if (between(frequency, 220, 440)) {
    return 3;
  }
  if (between(frequency, 110, 220)) {
    return 2;
  }
  if (between(frequency, 55, 110)) {
    return 1;
  }
  if (between(frequency, 27.5, 55)) {
    return 0;
  }
  return -1;
}

function between(val: number, lower: number, upper: number) {
  return val >= lower && val < upper ? true : false;
}

function removeDuplicates(arr: Note[]): Note[] {
  if (arr.length == 0) {
    return [];
  }
  return [arr[0]].concat(
    removeDuplicates(arr.filter(n => n.frequency != arr[0].frequency))
  );
}

function generateUpperRange(currentNote: Note, n, series = []): Note[] {
  series.push(currentNote);
  if (n == 0) {
    return series;
  }
  return generateUpperRange(
    {
      frequency: getNextFrequency(currentNote.frequency),
      pitchNames: getNextNameInSeries(
        currentNote.pitchNames,
        incrementPitchValue
      ),
      index: currentNote.index + 1,
      octave: getOctave(getNextFrequency(currentNote.frequency)),
      normalizedDuration: 0,
      normalizedStart: 0
    },
    n - 1,
    series
  );
}

function getNextFrequency(currentFrequency): number {
  return currentFrequency * Math.pow(2, 1 / 12);
}

function getNextNameInSeries(
  pitchNames: string[],
  nextPitchValueFunction: Function
): string[] {
  const currentPitchValue = pitchValues.find(
    pv => pv.pitchName == pitchNames[0]
  ).pitchValue;
  const nextPitchValue = nextPitchValueFunction(currentPitchValue);
  return pitchValues
    .filter(pv => pv.pitchValue == nextPitchValue)
    .map(pv => pv.pitchName);
}

function incrementPitchValue(currentPitchValue: number): number {
  return currentPitchValue < 11 ? currentPitchValue + 1 : 0;
}

function decrementPitchValue(currentPitchValue: number): number {
  return currentPitchValue == 0 ? 11 : currentPitchValue - 1;
}

function generateLowerRange(currentNote: Note, n, series = []): Note[] {
  series.push(currentNote);
  if (n == 0) {
    return series.reverse();
  }
  return generateLowerRange(
    {
      frequency: currentNote.frequency * Math.pow(2, -1 / 12),
      pitchNames: getNextNameInSeries(
        currentNote.pitchNames,
        decrementPitchValue
      ),
      index: currentNote.index + 1,
      octave: getOctave(getNextFrequency(currentNote.frequency)),
      normalizedDuration: 0,
      normalizedStart: 0
    },
    n - 1,
    series
  );
}

const pitchValues = [
  { pitchName: "A", pitchValue: 0 },

  { pitchName: "A#", pitchValue: 1 },
  { pitchName: "Bb", pitchValue: 1 },

  { pitchName: "B", pitchValue: 2 },
  { pitchName: "Cb", pitchValue: 2 },

  { pitchName: "B#", pitchValue: 3 },
  { pitchName: "C", pitchValue: 3 },

  { pitchName: "C#", pitchValue: 4 },
  { pitchName: "Db", pitchValue: 4 },

  { pitchName: "D", pitchValue: 5 },

  { pitchName: "D#", pitchValue: 6 },
  { pitchName: "Eb", pitchValue: 6 },

  { pitchName: "E", pitchValue: 7 },
  { pitchName: "Fb", pitchValue: 7 },

  { pitchName: "E#", pitchValue: 8 },
  { pitchName: "F", pitchValue: 8 },

  { pitchName: "F#", pitchValue: 9 },
  { pitchName: "Gb", pitchValue: 9 },

  { pitchName: "G", pitchValue: 10 },

  { pitchName: "G#", pitchValue: 11 },
  { pitchName: "Ab", pitchValue: 11 }
];
