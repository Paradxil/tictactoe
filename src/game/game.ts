import { Board, Cell, Winner } from "../types";

export class TicTacToe {
  board: Board;
  winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  winner: Winner;
  currentTurn: Cell;

  constructor(initialBoard?: Cell[], initialTurn?: Cell) {
    this.board =
      initialBoard ?? Array.from({ length: 9 }).map(() => Cell.EMPTY);
    this.currentTurn = initialTurn ?? Cell.X;
  }

  render = (selection?: { x: number; y: number }) => {
    const selectionIndex = selection ? selection.y * 3 + selection.x : -1;

    const output = `
   %s │ %s │ %s
  ───┼───┼───
   %s │ %s │ %s
  ───┼───┼───
   %s │ %s │ %s
    `;

    const cells = this.board.map((c, i) => {
      if (i === selectionIndex) {
        return c === Cell.EMPTY ? "#" : c.toLowerCase();
      }

      return c;
    });

    console.log(output, ...cells);

    return this;
  };

  // Convenience wrapper around moveAtIndex
  move = (x: number, y: number) => {
    if (x > 2 || x < 0 || y > 2 || y < 0) {
      throw new Error("Invalid position");
    }
    const index = y * 3 + x;

    return this.moveAtIndex(index);
  };

  // Plays a move at the given index for the current player.
  // Checks for a winner.
  // Switches whose turn it is.
  moveAtIndex = (index: number) => {
    if (index < 0 || index > 8) {
      throw new Error("Invalid position");
    }

    if (this.board[index] !== Cell.EMPTY) {
      throw new Error("Position already taken");
    }

    if (this.winner) {
      throw new Error("Game already completed");
    }

    this.board[index] = this.currentTurn;

    this.currentTurn = this.currentTurn === Cell.X ? Cell.O : Cell.X;

    this.getWinner();

    return this;
  };

  // Rank a move based on possible game outcomes.
  // This was the first solution I came up with, I'm sure there is a clever dynamic approach that would be more efficient.
  // Even this algorithm could be improved by aborting the search early when we find a winning move.
  // Another approach could be to pre calculate all possible moves and simply look up the next best move in a hash table.
  rankMove = (
    game: TicTacToe,
    desiredWinner: Winner,
    index: number,
    depth: number
  ): number => {
    game.moveAtIndex(index);

    // We want to prioritize winning in fewer moves.
    // A parent move should be worth as much as all of it's possible child moves.
    const multiplier = 1 / (depth * 9 + 1);

    if (game.winner === desiredWinner) {
      return 2 * multiplier;
    }

    if (game.winner === Winner.TIE) {
      return 1 * multiplier;
    }

    if (game.winner) {
      return -2 * multiplier;
    }

    return game.board.reduce((prev, cell, i) => {
      if (cell === Cell.EMPTY) {
        const nextGame = new TicTacToe([...game.board], game.currentTurn);
        return prev + nextGame.rankMove(nextGame, desiredWinner, i, depth + 1);
      }
      return prev;
    }, 0);
  };

  // Plays the best move based on the current board
  autoMove = () => {
    // If this is the first move pick a random starting position for fun
    if (this.board.every((c) => c === Cell.EMPTY)) {
      return this.moveAtIndex(Math.floor(Math.random() * 9));
    }

    // Create a list of possible moves sorted by their ranking.
    const moves = this.board
      .map((c, i) => ({
        cell: c,
        index: i,
      }))
      .filter(({ cell }) => cell === Cell.EMPTY)
      .map(({ index, cell }) => {
        const nextGame = new TicTacToe([...this.board], this.currentTurn);
        const rank = nextGame.rankMove(
          nextGame,
          this.currentTurn === Cell.O ? Winner.O : Winner.X,
          index,
          0
        );

        return {
          rank,
          index,
          cell,
        };
      })
      .sort((a, b) => b.rank - a.rank);

    // Make the highest ranked move
    const moveIndex = moves[0].index;
    return this.moveAtIndex(moveIndex);
  };

  getWinner = () => {
    // Return early if we already have a winner for this game.
    if (this.winner) {
      return this;
    }

    this.winningPositions.find((indices) => {
      // Check if all indices in the given position are filled by the same cell type
      const potentialWinner = indices
        .slice(1)
        .reduce(
          (prev, current) =>
            this.board[current] === prev ? this.board[current] : Cell.EMPTY,
          this.board[indices[0]]
        );

      const playerWon = potentialWinner !== Cell.EMPTY;

      if (playerWon) {
        this.winner = potentialWinner === Cell.X ? Winner.X : Winner.O;
      }

      return playerWon;
    });

    if (!this.board.includes(Cell.EMPTY)) {
      this.winner = Winner.TIE;
    }

    return this;
  };
}
