import { Component, OnInit, ViewChild } from "@angular/core";
import { Score } from "src/app/models/score";
import { Measure } from "../models/measure";
import { Note } from "src/app/models/note";
import { playPhrase } from "../music-player";
import { AfterViewInit } from "@angular/core";
import { ElementRef } from "@angular/core";

@Component({
  selector: "app-ode-to-joy-score",
  templateUrl: "./ode-to-joy-score.component.html",
  styleUrls: ["./ode-to-joy-score.component.css"]
})
export class OdeToJoyScoreComponent implements AfterViewInit {
  @ViewChild("score") inputScore: ElementRef;
  constructor() {}

  ngAfterViewInit() {
    console.log(this.inputScore);
    const inputMeasures: any = Array.from(
      this.inputScore.nativeElement.childNodes
    );
    const score: Score = {
      measures: this.sheetToScore(inputMeasures)
    };
    playPhrase(score);
  }
  sheetToScore(sheet: Node[]): Measure[] {
    return sheet.map((measure: Node) => {
      const newMeasure: Measure = { timeSignature: "4/4", notes: [] };
      const notes = Array.from(measure.childNodes);
      newMeasure.notes = notes
        .map(n => {
          return n.attributes.getNamedItem("class").value.split(" ");
        })
        .filter((n: string[]) => n.length == 2)
        .map((s: string[]) => {
          const note: Note = {
            pitchNames: [s[0][0].toUpperCase()],
            octave: Number(s[0][1]),
            normalizedDuration: stringToDuration(s[1])
          };
          return note;
        });
      return newMeasure;
    });
  }
}

export function stringToDuration(s: string): number {
  switch (s) {
    case "eighth-note":
      return 0.125;
    case "quarter-note":
      return 0.25;
    case "half-note":
      return 0.5;
    case "three-eighth-note":
      return 0.375;
    default:
      break;
  }
}
