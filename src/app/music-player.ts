import { Sound } from "./sound";
import { Score } from "./score";
import { ReplaySubject, Subject } from "rxjs";
import { Note } from "./note";
import { generateNotesSeries } from "./note-series-generator";
import { Measure } from "./measure";

export function playPhrase(score: Score) {
  const s: Subject<Sound> = new ReplaySubject();
  const notes = concatMeasures(score.measures);

  const sounds: Sound[] = notes
    .map(denormalizeNote()(generateNotesSeries(28))(120))
    .reduce(notesTemporalLocationReducerFn, []);

  sounds.forEach(sound =>
    setTimeout(() => {
      s.next(sound);
    }, sound.startTime)
  );

  const audioContext: AudioContext = new ((<any>window).AudioContext ||
    (<any>window).webkitAudioContext)();

  s.subscribe(note => {
    playBell(audioContext)(note.frequency)(note.duration);
  });
}

function notesTemporalLocationReducerFn(acc: Sound[], sound: Sound) {
  if (acc.length == 0) {
    sound.startTime = 0;
    return [sound];
  } else {
    const previousNote = acc[acc.length - 1];
    const startTime = previousNote.startTime + previousNote.duration;
    sound.startTime = startTime;

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

export function denormalizeDuration(bpm: number, note: Note) {
  return ((note.normalizedDuration * bpm) / 60) * 1000;
}

export function getFrequency(referenceNotes: Note[], note: Note) {
  const frequency = referenceNotes.find(
    refNote =>
      refNote.octave == note.octave &&
      refNote.pitchNames.includes(note.pitchNames[0])
  ).frequency;
  return frequency;
}

export function concatMeasures(measures: Measure[]): Note[] {
  return measures.reduce(
    (all: Note[], measure: Measure) => all.concat(measure.notes),
    []
  );
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
