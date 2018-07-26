import { Score } from "./score";
import { ReplaySubject, Subject } from "rxjs";
import { Note } from "./app.component";

export function playPhrase(score: Score) {
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

export function playBell() {
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

export function playFrequency(gain = 0) {
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
