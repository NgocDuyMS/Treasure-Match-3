import { GemType, CellModifier } from './gem';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  id: string; // Quan trọng để render animation
  type: GemType;
  modifier: CellModifier;
  position: Position;
}

export type Board = Cell[][];