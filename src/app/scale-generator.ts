import { Note } from "./models/note";

export function getMajorKey(chromaticSeries: Note[], key: string): Note[] {
  switch (key) {
    case "C":
      // Demo: Filter/Some
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
    keyNotes.findIndex(n => n.pitchNames.includes(rootNote))
  );
}
