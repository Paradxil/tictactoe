import { Board, Cell } from "./types";

export class TicTacToe {
  board: Board = Array.from({ length: 9 }).map(() => Cell.EMPTY);

  render = () => {
    const output = `
   %s │ %s │ %s
  ───┼───┼───
   %s │ %s │ %s
  ───┼───┼───
   %s │ %s │ %s
    `;

    console.log(output, ...this.board);

    return this;
  };

  move = (x: number, y: number, player: Cell) => {
    if (x > 8 || x < 0 || y > 8 || y < 0) {
      throw new Error("Invalid position");
    }

    const index = y * 3 + x;

    if (this.board[index] !== Cell.EMPTY) {
      throw new Error("Position already taken");
    }

    this.board[index] = player;

    return this;
  };
}
