import { Note } from "./note";

export interface Measure {
  timeSignature?: string;
  notes: Note[];
}
