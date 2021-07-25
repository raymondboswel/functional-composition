import { Score } from "./models/score";
import { Component, OnInit } from "@angular/core";
import { generateNotesSeries } from "./note-series-generator";
import { getMajorKey, getTonicScale } from "./scale-generator";
import { delay } from "q";
import { Subject, ReplaySubject, Observable, timer, of, from } from "rxjs";
import { mergeMap, concatMap, map } from "rxjs/operators";
import { skip, filter } from "rxjs/operators";
import { Note } from "./models/note";

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

  ngOnInit() {}
}
