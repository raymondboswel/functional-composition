import { Note } from "./app.component";

export function getMajorKey(chromaticSeries: Note[], key: string): Note[] {
  switch (key) {
    case "C":
      return chromaticSeries.filter(n =>
        n.pitchNames.some(pn =>
          ["C", "D", "E", "F", "G", "A", "B"].includes(pn)
        )
      );

    default:
      return [];
  }
}

export function getTonicScale(keyNotes: Note[], rootNote: string): Note[] {
  return keyNotes.slice(
    keyNotes.findIndex(n => n.pitchNames.includes(rootNote)),
    keyNotes.length -
      keyNotes.reverse().findIndex(n => n.pitchNames.includes(rootNote)) +
      1
  );
}
