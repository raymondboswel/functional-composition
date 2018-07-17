import { Component, OnInit } from "@angular/core";
import { generateNotesSeries } from "./note-series-generator";

export interface Note {
  frequency: number;
  index: number;
  pitchNames: string[];
  octave: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";

  ngOnInit() {
    // this.playNote()(300)(2);
    const series: Note[] = generateNotesSeries(27.5, 48);

    // this.playNote()(series[40].frequency)(0.5);
    this.playBell()(series[43].frequency)(0.5);
  }

  playBell() {
    return (frequency: number) => (duration: number) => {
      // this.playNote()(frequency)(duration);
      // this.playNote(-0.88)(2 * frequency)(duration);
      // this.playNote(-0.9)(3 * frequency)(duration);
      // this.playNote(-0.95)(4 * frequency)(duration);
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
      // oscillator.connect(gainNode);
      oscillator.frequency.value = frequency; // value in hertz
      oscillator.type = "sine";

      gainNode.gain.value = gain;

      oscillator.connect(audioContext.destination);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(0);
      oscillator.stop(audioContext.currentTime + duration);
    };
  }
}
