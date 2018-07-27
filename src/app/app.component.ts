import { Score } from "./score";
import { Component, OnInit } from "@angular/core";
import { generateNotesSeries } from "./note-series-generator";
import { getMajorKey, getTonicScale } from "./scale-generator";
import { delay } from "q";
import { Subject, ReplaySubject, Observable, timer, of, from } from "rxjs";
import { mergeMap, concatMap, map } from "rxjs/operators";
import { skip, filter } from "rxjs/operators";
import { playPhrase } from "./music-player";
import { Note } from "./note";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";

  audioContext: AudioContext = new ((<any>window).AudioContext ||
    (<any>window).webkitAudioContext)();

  quarterNote(note: Note): Note {
    return this.applyDuration(note, 1 / 4);
  }

  eighthNote(note: Note) {
    return this.applyDuration(note, 1 / 8);
  }

  applyDuration(note: Note, duration: number): Note {
    return { ...note, normalizedDuration: duration };
  }

  ngOnInit() {
    // const series: Note[] = generateNotesSeries(28);
    // console.log("note series");
    // console.log(series);
    // const cMajorKey: Note[] = getMajorKey(series, "C");
    // const cMajorScale: Note[] = getTonicScale(cMajorKey, "C");
    // console.log("Cmajor");
    // console.log(cMajorScale);
    // const c4Index = cMajorScale.findIndex(
    //   n => n.octave == 4 && n.pitchNames.includes("C")
    // );
    // let notes = cMajorScale.slice(c4Index, c4Index + 18);
    // notes = notes.map(n => {
    //   return { ...n, normalizedDuration: 0.5 * 1000 };
    // });
    // console.log(notes);
    // const score: Score = {
    //   measures: [
    //     {
    //       timeSignature: "4/4",
    //       notes: notes
    //     }
    //   ]
    // };
    // playPhrase(score);
  }
}
