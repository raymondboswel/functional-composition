import { generateNotesSeries } from "./note-series-generator";

describe("NoteSeriesGenerator", () => {
  it("should create a symmetrical series ", () => {
    const series = generateNotesSeries(4);
    console.log(series);
    expect(series.length).toEqual(7);
  });
});
