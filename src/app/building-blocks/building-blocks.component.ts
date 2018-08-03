import { Component, OnInit } from "@angular/core";
import { Note } from "../models/note";
import { generateNotesSeries } from "../note-series-generator";
import { getMajorKey, getTonicScale } from "../scale-generator";
import { playScore, playBell, playTone } from "../music-player";
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

  ngOnInit() {}

  filterNotes() {
    this.cMajorKey = getMajorKey(this.chromaticScale, "C");
    this.cMajorScale = getTonicScale(this.cMajorKey, "C");
  }

  generateChromaticScale() {
    this.chromaticScale = generateNotesSeries(28, this.referenceFrequency);
  }

  printToHtml() {
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
    playScore({ measures: [{ notes: notes }] }, 200);
  }

  playSingleTone() {
    this.cMajorScale = getTonicScale(this.cMajorKey, "C").map(n => {
      return { ...n, normalizedDuration: 0.2 };
    });
    const c4Index = this.cMajorScale.findIndex(
      n => n.octave == 4 && n.pitchNames.includes("C")
    );
    const audioContext: AudioContext = new ((<any>window).AudioContext ||
      (<any>window).webkitAudioContext)();
    playTone(audioContext)(this.cMajorScale[c4Index].frequency)(2000);
  }

  playBell() {
    this.cMajorScale = getTonicScale(this.cMajorKey, "C").map(n => {
      return { ...n, normalizedDuration: 0.2 };
    });
    const c4Index = this.cMajorScale.findIndex(
      n => n.octave == 4 && n.pitchNames.includes("C")
    );
    const audioContext: AudioContext = new ((<any>window).AudioContext ||
      (<any>window).webkitAudioContext)();
    playBell(audioContext)(this.cMajorScale[c4Index].frequency)(3000);
  }
}
