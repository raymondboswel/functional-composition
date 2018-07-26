import { Component, OnInit, ViewChild } from "@angular/core";
import { Score } from "src/app/score";
import { Measure } from "../measure";
import { Note } from "src/app/app.component";

@Component({
  selector: "app-ode-to-joy-score",
  templateUrl: "./ode-to-joy-score.component.html",
  styleUrls: ["./ode-to-joy-score.component.css"]
})
export class OdeToJoyScoreComponent implements OnInit {
  @ViewChild("score") inputScore: HTMLDivElement;
  score: Score = { measures: [] };
  constructor() {}

  ngOnInit() {
    const inputMeasures = Array.from(this.inputScore.childNodes);
    inputMeasures.map((measure: Node) => {
      const newMeasure: Measure = { timeSignature: "4/4", notes: [] };
      const notes = Array.from(measure.childNodes);
      newMeasure.notes = notes
        .map(n => {
          return n.attributes.getNamedItem("class").value.split(" ");
        })
        .filter((n: string[]) => n.length == 2)
        .map((s: string[]) => {
          const note: Note = {
            pitchNames: [s[0][0]],
            octave: Number(s[0][1]),
            normalizedDuration: stringToDuration(s[1])
          };
          return note;
        });
    });
  }
}

export function stringToDuration(s: string): number {
  switch (s) {
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
