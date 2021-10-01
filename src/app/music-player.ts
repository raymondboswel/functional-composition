import { Sound } from "./models/sound";
import { Score } from "./models/score";
import {
  ReplaySubject,
  Subject,
  Subscription,
  Observable,
  never,
  BehaviorSubject
} from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Note } from "./models/note";
import { generateNotesSeries } from "./note-series-generator";
import { Measure } from "./models/measure";

export function scoreToSubject(score: Score, bpm: number): Subject<Sound> {
  const s: Subject<Sound> = new Subject();
  const notes = concatMeasures(score.measures).reverse();

  // Before:

  // const series: Note[] = generateNotesSeries(28);
  // notes[0].normalizedStart = 0;

  // notes = notes.map(note => {
  //   note.frequency = series.find(
  //     refNote =>
  //       refNote.octave == note.octave &&
  //       refNote.pitchNames.includes(note.pitchNames[0])
  //   ).frequency;
  //   note.normalizedDuration = note.normalizedDuration * 2000;
  //   return note;
  // });

  // const normalizedNotes = notes.reduce((acc: Note[], note: Note) => {
  //   if (acc.length == 0) {
  //     return [note];
  //   } else {
  //     const previousNote = acc[acc.length - 1];
  //     const startTime =
  //       previousNote.normalizedStart + previousNote.normalizedDuration;
  //     console.log(startTime);
  //     note.normalizedStart = startTime;

  //     return [...acc, note];
  //   }
  // }, []);

  const sounds: Sound[] = notes
    .map(denormalizeNote()(generateNotesSeries(28))(bpm))
    .reverse()
    .reduce(notesTemporalLocationReducerFn, []);

  sounds.forEach(sound =>
    setTimeout(() => {
      s.next(sound);
    }, sound.startTime)
  );

  return s;
}

export function playScore(score: Score, bpm: number) {
  const audioContext: AudioContext = new ((<any>window).AudioContext ||
    (<any>window).webkitAudioContext)();

  scoreToSubject(score, bpm).subscribe(sound => {
    playBell(audioContext)(sound.frequency)(sound.duration);
    console.log(sound);
  });
}

function notesTemporalLocationReducerFn(acc: Sound[], sound: Sound) {
  if (acc.length == 0) {
    sound.startTime = 0;
    return [sound];
  } else {
    const previousNote = acc[acc.length - 1];
    sound.startTime = previousNote.startTime + previousNote.duration;
    return [...acc, sound];
  }
}

function denormalizeNote() {
  return (referenceNotes: Note[]) => (bpm: number) => (note: Note): Sound => {
    return {
      frequency: getFrequency(referenceNotes, note),
      duration: denormalizeDuration(bpm, note)
    };
  };
}

function denormalizeDuration(bpm: number, note: Note) {
  return ((note.normalizedDuration * 240) / bpm) * 1000;
}

function getFrequency(referenceNotes: Note[], note: Note) {
  const frequency = referenceNotes.find(
    refNote =>
      refNote.octave == note.octave &&
      refNote.pitchNames.includes(note.pitchNames[0])
  ).frequency;
  return frequency;
}

function concatMeasures(measures: Measure[]): Note[] {
  return measures.reduce(
    (all: Note[], measure: Measure) => all.concat(measure.notes),
    []
  );
}

// Demo: Play Tone
export function playTone(audioContext) {
  return (frequency: number) => (duration: number) => {
    const oscillators = [];
    playFrequency(audioContext, -0.1)(frequency)(duration);
  };
}

// Demo: Play Bell
export function playBell(audioContext) {
  return (frequency: number) => (duration: number) => {
    const oscillators = [];
    playFrequency(audioContext, -0.1)(frequency)(duration);
    playFrequency(audioContext, -0.85)(2 * frequency)(duration);
    playFrequency(audioContext, -0.95)(3 * frequency)(duration);
    playFrequency(audioContext, -0.95)(4.2 * frequency)(duration);
    playFrequency(audioContext, -0.95)(5.5 * frequency)(duration);
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
