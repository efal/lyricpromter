export interface Song {
  id: string;
  title: string;
  lyrics: string;
  fontSize: number;
  scrollSpeed: number; // Speed multiplier
  bpm: number;
  micThreshold: number; // Volume level from 0-100 to start scrolling
}
