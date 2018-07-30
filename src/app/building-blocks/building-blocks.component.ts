import { Component, OnInit } from "@angular/core";
import { Note } from "../models/note";
import { generateNotesSeries } from "../note-series-generator";
import { getMajorKey, getTonicScale } from "../scale-generator";
import { playScore, playBell } from "../music-player";
import { Score } from "../models/score";
import * as _ from "lodash";

@Component({
  selector: "app-building-blocks",
  templateUrl: "./building-blocks.component.html",
  styleUrls: ["./building-blocks.component.css"]
})
export class BuildingBlocksComponent implements OnInit {
  constructor() {}

  chromaticScale: Note[];
  cMajorScale: Note[] = [];
  cMajorKey: Note[];
  score: Score;
  referenceFrequency = 440;

  ngOnInit() {
    // this.chromaticScale = generateNotesSeries(28);
    // const cMajorKey: Note[] = getMajorKey(this.chromaticScale, "C");
    // const cMajorScale: Note[] = getTonicScale(cMajorKey, "C");
    // const c4Index = cMajorScale.findIndex(
    //   n => n.octave == 4 && n.pitchNames.includes("C")
    // );
    // const notes = cMajorScale.slice(c4Index, c4Index + 8);
    // this.score = {
    //   measures: _.chunk(notes, 4).map(n => {
    //     return {
    //       notes: n.map(nte => {
    //         return {
    //           ...nte,
    //           pitchNames: nte.pitchNames.map(p => p.toLowerCase())
    //         };
    //       })
    //     };
    //   })
    // };
    // playScore({
    //   ...this.score,
    //   measures: this.score.measures.map(m => {
    //     return {
    //       ...m,
    //       notes: m.notes.map(nts => {
    //         return {
    //           ...nts,
    //           pitchNames: nts.pitchNames.map(p => p.toUpperCase()),
    //           normalizedDuration: 0.2
    //         };
    //       })
    //     };
    //   })
    // });
  }

  filterNotes() {
    this.cMajorKey = getMajorKey(this.chromaticScale, "C");
    this.cMajorScale = getTonicScale(this.cMajorKey, "C");
  }

  generateChromaticScale() {
    this.chromaticScale = generateNotesSeries(28, this.referenceFrequency);
  }

  printToHtml() {
    console.log(this.cMajorScale);
    const c4Index = this.cMajorScale.findIndex(
      n => n.octave == 4 && n.pitchNames.includes("C")
    );
    const notes = this.cMajorScale.slice(c4Index, c4Index + 8);
    this.score = {
      measures: _.chunk(notes, 4).map(n => {
        return {
          notes: n.map(nte => {
            return {
              ...nte,
              pitchNames: nte.pitchNames.map(p => p.toLowerCase())
            };
          })
        };
      })
    };
  }

  playNotes() {
    this.cMajorScale = getTonicScale(this.cMajorKey, "C").map(n => {
      return { ...n, normalizedDuration: 0.2 };
    });
    const c4Index = this.cMajorScale.findIndex(
      n => n.octave == 4 && n.pitchNames.includes("C")
    );
    const notes = this.cMajorScale.slice(c4Index, c4Index + 8);
    playScore({ measures: [{ notes: notes }] });
  }
}
