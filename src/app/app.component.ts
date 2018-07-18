import { Score } from "./score";
import { Component, OnInit } from "@angular/core";
import { generateNotesSeries } from "./note-series-generator";

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

  quarterNote(note: Note): Note {
    return this.applyDuration(note, 1 / 4);
  }

  eighthNote(note: Note) {
    return this.applyDuration(note, 1 / 8);
  }

  applyDuration(note: Note, duration: number): Note {
    return { ...note, normalizedDuration: duration };
  }

  generateRun() {}

  getMajorKey(chromaticSeries: Note[], key: string): Note[] {
    switch (key) {
      case "C":
        return chromaticSeries.filter(n =>
          n.pitchNames.some(pn =>
            ["C", "D", "E", "F", "G", "A", "B"].includes(pn)
          )
        );

      default:
        return [];
    }
  }

  ngOnInit() {
    // this.playNote()(300)(2);
    const series: Note[] = generateNotesSeries(20);
    const cMajor: Note[] = this.getMajorKey(series, "C");
    // this.playNote()(series[40].frequency)(0.5);
    // this.playBell()(series[20].frequency)(3);

    const score: Score = {
      measures: [
        {
          timeSignature: "4/4",
          notes: []
        }
      ]
    };
  }

  playBell() {
    return (frequency: number) => (duration: number) => {
      const oscillators = [];
      this.playNote(-0.3)(frequency)(duration);
      this.playNote(-0.95)(2 * frequency)(duration);

      this.playNote(-0.98)(3 * frequency)(duration);
      this.playNote(-0.99)(4 * frequency)(duration);
      // this.playNote(-0.99)(5 * frequency)(duration);
      // this.playNote(-0.99)(6 * frequency)(duration);
      // this.playNote(-0.99)(7 * frequency)(duration);
    };
  }

  playNote(gain = 0) {
    return (frequency: number) => (duration: number) => {
      const audioContext: AudioContext = new ((<any>window).AudioContext ||
        (<any>window).webkitAudioContext)();
      const gainNode: GainNode = audioContext.createGain();
      const oscillator: OscillatorNode = audioContext.createOscillator();
      oscillator.frequency.value = frequency; // value in hertz
      oscillator.type = "sine";

      gainNode.gain.value = -1;

      oscillator.connect(audioContext.destination);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.linearRampToValueAtTime(gain, 0.01);
      gainNode.gain.linearRampToValueAtTime(-1, audioContext.currentTime + 2.5);

      oscillator.start(0);
      oscillator.stop(audioContext.currentTime + duration);
    };
  }
}
