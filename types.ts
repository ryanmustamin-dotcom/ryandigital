export type GameMode = 'MENU' | 'COLOR' | 'SHAPE' | 'TYPE' | 'LAYOUT';

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ShapeLevel {
  id: number;
  name: string;
  p0: Point; // Start
  p1: Point; // Control 1 (Target)
  p2: Point; // Control 2 (Target)
  p3: Point; // End
  instruction: string;
}

export interface TypeLevel {
  id: number;
  word: string; // e.g., "WAVE"
  fontFamily: string;
  idealSpacings: number[]; // Array of ideal pixel gaps between letters
  instruction: string;
}

export interface LayoutElement {
  id: string;
  type: 'box' | 'text' | 'image';
  label?: string; // e.g., "Header", "Image"
  width: number;
  height: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
}

export interface LayoutLevel {
  id: number;
  name: string;
  instruction: string;
  gridType: 'center' | 'thirds' | 'columns' | 'none'; // To show overlay guide
  elements: LayoutElement[];
}

export interface GameResult {
  score: number;
  message: string;
  title: string;
}