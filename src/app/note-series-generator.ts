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
      frequency: currentNote.frequency * Math.pow(2, 1 / 12),
      pitchNames: getNextNameInSeries(
        currentNote.pitchNames,
        incrementPitchValue
      ),
      index: currentNote.index + 1,
      octave: 4,
      normalizedDuration: 0,
      normalizedStart: 0
    },
    n - 1,
    series
  );
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
  return currentPitchValue < 9 ? currentPitchValue + 1 : 0;
}

function decrementPitchValue(currentPitchValue: number): number {
  return currentPitchValue == 0 ? 9 : currentPitchValue - 1;
}

function generateLowerRange(currentNote: Note, n, series = []): Note[] {
  if (n == 0) {
    return series;
  }
  series.push(currentNote);
  return generateLowerRange(
    {
      frequency: currentNote.frequency * Math.pow(2, -1 / 12),
      pitchNames: getNextNameInSeries(
        currentNote.pitchNames,
        decrementPitchValue
      ),
      index: currentNote.index + 1,
      octave: 4,
      normalizedDuration: 0,
      normalizedStart: 0
    },
    n - 1,
    series
  ).reverse();
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

  { pitchName: "E", pitchValue: 6 },
  { pitchName: "Fb", pitchValue: 6 },

  { pitchName: "E#", pitchValue: 7 },
  { pitchName: "F", pitchValue: 7 },

  { pitchName: "F#", pitchValue: 8 },
  { pitchName: "Gb", pitchValue: 8 },

  { pitchName: "G", pitchValue: 9 },

  { pitchName: "G#", pitchValue: 10 },
  { pitchName: "Ab", pitchValue: 10 }
];
