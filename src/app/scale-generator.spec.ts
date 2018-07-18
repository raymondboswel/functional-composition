import { generateNotesSeries } from "./note-series-generator";
import { getTonicScale, getMajorKey } from "./scale-generator";
import { Note } from "./app.component";

describe("ScaleGenerator", () => {
  fit("should generate a tonic scale given constituent notes of key and root note", () => {
    const series = generateNotesSeries(20);
    const cMajorKey: Note[] = getMajorKey(series, "C");
    expect(cMajorKey.findIndex(n => n.pitchNames.includes("C"))).toEqual(5);
    expect(
      cMajorKey.reverse().findIndex(n => n.pitchNames.includes("C"))
    ).toEqual(5);
    expect(cMajorKey.length).toEqual(29);
    const cMajorScale: Note[] = getTonicScale(cMajorKey, "C");
    expect(cMajorScale.length).toEqual(20);
    console.log(cMajorScale[cMajorScale.length - 1]);
    // expect(cMajorScale[0].pitchNames).toEqual(["C"]);
  });
});
