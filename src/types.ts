export enum Cell {
  X = "X",
  O = "O",
  EMPTY = " ",
}

export enum Winner {
  X = "X",
  O = "O",
  TIE = "TIE",
}

export type Board = Cell[];
