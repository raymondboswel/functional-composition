import { Score } from "./score";
import { Component, OnInit } from "@angular/core";
import { generateNotesSeries } from "./note-series-generator";
import { getMajorKey, getTonicScale } from "./scale-generator";
import { delay } from "q";
import { Subject, ReplaySubject, Observable, timer, of, from } from "rxjs";
import { mergeMap, concatMap, map } from "rxjs/operators";
import { skip, filter } from "rxjs/operators";

export interface Note {
  frequency: number;
  index: number;
  pitchNames: string[];
  octave: number;
  normalizedDuration: number; // A number constrained to 1/8, 1/4, 1/2, 1/3, 1, 2, etc.
  normalizedStart: number; // At what point in the measure does the note start.
}

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
    const series: Note[] = generateNotesSeries(28);
    console.log("note series");
    console.log(series);
    const cMajorKey: Note[] = getMajorKey(series, "C");
    const cMajorScale: Note[] = getTonicScale(cMajorKey, "C");
    console.log("Cmajor");
    console.log(cMajorScale);
    const c4Index = cMajorScale.findIndex(
      n => n.octave == 4 && n.pitchNames.includes("C")
    );
    // this.playPhrase(
    // cMajorScale.slice(c4Index, c4Index + 8).map(n => {
    //   return { ...n, normalizedDuration: 0.5 };
    // })
    // );

    console.log("C4Index", c4Index);
    let notes = cMajorScale.slice(c4Index, c4Index + 18);
    console.log(notes);
    notes = notes.map(n => {
      return { ...n, normalizedDuration: 0.5 * 1000 };
    });
    console.log(notes);
    const score: Score = {
      measures: [
        {
          timeSignature: "4/4",
          notes: notes
        }
      ]
    };
    this.playPhrase(score);
  }

  playPhrase(score: Score) {
    const s: Subject<Note> = new ReplaySubject();
    // Observable.create(() => )
    const notes = score.measures[0].notes;

    const normalizedNotes = notes.reduce((acc: Note[], note: Note) => {
      if (acc.length == 0) {
        return [note];
      } else {
        const previousNote = acc[acc.length - 1];
        const startTime =
          previousNote.normalizedStart + previousNote.normalizedDuration;
        console.log(startTime);
        note.normalizedStart = startTime;

        return [...acc, note];
      }
    }, []);

    normalizedNotes.forEach(note =>
      setTimeout(() => {
        s.next(note);
      }, note.normalizedStart)
    );

    s.asObservable().subscribe(note => {
      console.log(
        "subsc " +
          note.pitchNames[0] +
          ":" +
          note.normalizedDuration +
          ":" +
          note.normalizedStart +
          ":" +
          note.frequency
      );
      this.playBell()(note.frequency)(note.normalizedDuration * 0.9);
    });
  }

  playBell() {
    return (frequency: number) => (duration: number) => {
      const oscillators = [];
      this.playFrequency(-0.1)(frequency)(duration);
      this.playFrequency(-0.85)(2 * frequency)(duration);

      this.playFrequency(-0.95)(3 * frequency)(duration);
      // this.playFrequency(-0.89)(4 * frequency)(duration);
      // this.playFrequency(-0.97)(5 * frequency)(duration);
      // this.playFrequency(-0.99)(6 * frequency)(duration);
    };
  }

  playFrequency(gain = 0) {
    return (frequency: number) => (duration: number) => {
      const gainNode: GainNode = this.audioContext.createGain();
      const oscillator: OscillatorNode = this.audioContext.createOscillator();
      oscillator.frequency.value = frequency; // value in hertz
      oscillator.type = "sine";

      gainNode.gain.value = -1;

      oscillator.connect(this.audioContext.destination);
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.exponentialRampToValueAtTime(
        gain,
        this.audioContext.currentTime + 0.05
      );
      gainNode.gain.exponentialRampToValueAtTime(
        -1,
        this.audioContext.currentTime + duration / 1000
      );

      oscillator.start(this.audioContext.currentTime + 0.01);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    };
  }
}
