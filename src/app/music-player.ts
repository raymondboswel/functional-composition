import { Score } from "./score";
import { ReplaySubject, Subject } from "rxjs";
import { Note } from "./app.component";
import { generateNotesSeries } from "./note-series-generator";
import { Measure } from "./measure";

export function playPhrase(score: Score) {
  console.log(score);
  const s: Subject<Note> = new ReplaySubject();
  // Observable.create(() => )
  let notes = score.measures.reduce(
    (all: Note[], measure: Measure) => all.concat(measure.notes),
    []
  );

  const series: Note[] = generateNotesSeries(28);
  console.log(notes);
  notes[0].normalizedStart = 0;

  notes = notes.map(note => {
    note.frequency = series.find(
      refNote =>
        refNote.octave == note.octave &&
        refNote.pitchNames.includes(note.pitchNames[0])
    ).frequency;
    note.normalizedDuration = note.normalizedDuration * 2000;
    return note;
  });

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
      console.log(note);
      s.next(note);
    }, note.normalizedStart)
  );

  const audioContext: AudioContext = new ((<any>window).AudioContext ||
    (<any>window).webkitAudioContext)();

  s.subscribe(note => {
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

    playBell(audioContext)(note.frequency)(note.normalizedDuration * 0.9);
  });
}

export function playBell(audioContext) {
  return (frequency: number) => (duration: number) => {
    const oscillators = [];
    playFrequency(audioContext, -0.1)(frequency)(duration);
    playFrequency(audioContext, -0.85)(2 * frequency)(duration);

    playFrequency(audioContext, -0.95)(3 * frequency)(duration);
    // this.playFrequency(-0.89)(4 * frequency)(duration);
    // this.playFrequency(-0.97)(5 * frequency)(duration);
    // this.playFrequency(-0.99)(6 * frequency)(duration);
  };
}

export function playFrequency(audioContext, gain = 0) {
  return (frequency: number) => (duration: number) => {
    const gainNode: GainNode = audioContext.createGain();
    const oscillator: OscillatorNode = audioContext.createOscillator();
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.type = "sine";

    gainNode.gain.value = -1;

    oscillator.connect(audioContext.destination);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.exponentialRampToValueAtTime(
      gain,
      audioContext.currentTime + 0.05
    );
    gainNode.gain.exponentialRampToValueAtTime(
      -1,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime + 0.01);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  };
}
