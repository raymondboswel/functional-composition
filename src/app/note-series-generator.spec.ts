import { generateNotesSeries, getOctave } from "./note-series-generator";

describe("NoteSeriesGenerator", () => {
  it("should create a symmetrical series ", () => {
    const series = generateNotesSeries(4);
    console.log(series);
    expect(series.length).toEqual(7);
  });

  fit("should assign the correct octave to a frequency", () => {
    expect(getOctave(440)).toEqual(4);
    expect(getOctave(400)).toEqual(3);
    expect(getOctave(200)).toEqual(2);
    expect(getOctave(100)).toEqual(1);
  });
});
