import { Note } from "src/app/models/note";

export function generateNotesSeries(
  n: number,
  referenceAFrequency = 440
): Note[] {
  const referenceA = {
    frequency: referenceAFrequency,
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

function generateUpperRange(currentNote: Note, n, series = []): Note[] {
  series.push(currentNote);
  if (n == 0) {
    return series;
  }
  return generateUpperRange(generateHigherNote(currentNote), n - 1, series);
}

function generateLowerRange(currentNote: Note, n, series = []): Note[] {
  series.push(currentNote);
  if (n == 0) {
    return series.reverse();
  }
  return generateLowerRange(generateLowerNote(currentNote), n - 1, series);
}

function setOctave(note: Note) {
  return { ...note, octave: getOctave(note.frequency) };
}

function inclusiveBetween(val: number, lower: number, upper: number) {
  return val >= lower && val <= upper ? true : false;
}

function removeDuplicates(arr: Note[]): Note[] {
  if (arr.length == 0) {
    return [];
  }
  return [arr[0]].concat(
    removeDuplicates(arr.filter(n => n.frequency != arr[0].frequency))
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

function generateHigherNote(currentNote): Note {
  const nextFrequency = getNextFrequency(currentNote.frequency);
  return {
    frequency: nextFrequency,
    pitchNames: getNextNameInSeries(
      currentNote.pitchNames,
      incrementPitchValue
    ),
    octave: getOctave(nextFrequency),
    normalizedDuration: 0
  };
}

function generateLowerNote(currentNote): Note {
  return {
    frequency: currentNote.frequency * Math.pow(2, -1 / 12),
    pitchNames: getNextNameInSeries(
      currentNote.pitchNames,
      decrementPitchValue
    ),
    octave: getOctave(currentNote.frequency * Math.pow(2, -1 / 12)),
    normalizedDuration: 0
  };
}

function getOctave(frequency: number) {
  if (inclusiveBetween(Math.floor(frequency), 1976, 3951)) {
    return 7;
  }
  if (inclusiveBetween(Math.floor(frequency), 988, 1975)) {
    return 6;
  }
  if (inclusiveBetween(Math.floor(frequency), 494, 987)) {
    return 5;
  }
  if (inclusiveBetween(Math.floor(frequency), 247, 493)) {
    return 4;
  }
  if (inclusiveBetween(Math.floor(frequency), 124, 246)) {
    return 3;
  }
  if (inclusiveBetween(Math.floor(frequency), 62, 123)) {
    return 2;
  }
  if (inclusiveBetween(Math.floor(frequency), 31, 61)) {
    return 1;
  }
  if (inclusiveBetween(Math.floor(frequency), 16, 30)) {
    return 0;
  }
  return -1;
}

const pitchValues = [
  { pitchName: "A", pitchValue: 0 },

  { pitchName: "A#", pitchValue: 1 },
  { pitchName: "Bb", pitchValue: 1 },

  { pitchName: "B", pitchValue: 2 },

  { pitchName: "C", pitchValue: 3 },

  { pitchName: "C#", pitchValue: 4 },
  { pitchName: "Db", pitchValue: 4 },

  { pitchName: "D", pitchValue: 5 },

  { pitchName: "D#", pitchValue: 6 },
  { pitchName: "Eb", pitchValue: 6 },

  { pitchName: "E", pitchValue: 7 },

  { pitchName: "F", pitchValue: 8 },

  { pitchName: "F#", pitchValue: 9 },
  { pitchName: "Gb", pitchValue: 9 },

  { pitchName: "G", pitchValue: 10 },

  { pitchName: "G#", pitchValue: 11 },
  { pitchName: "Ab", pitchValue: 11 }
];
