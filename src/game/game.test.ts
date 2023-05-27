import { Cell, Winner } from "../types";
import { TicTacToe } from "./game";

describe("game", () => {
  let logSpy: jest.SpyInstance;
  let game: TicTacToe;

  beforeEach(() => {
    game = new TicTacToe();
    logSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders empty board", async () => {
    game.render();

    const cellsDrawn = logSpy.mock.calls[0].slice(1);

    expect(cellsDrawn.includes(Cell.O)).toBeFalsy();
    expect(cellsDrawn.includes(Cell.X)).toBeFalsy();
  });

  it("renders selection", async () => {
    game.render({ x: 0, y: 0 });

    const cellsDrawn = logSpy.mock.calls[0].slice(1);

    expect(cellsDrawn.includes("#")).toBeTruthy();
  });

  it("renders selection when current position is taken", async () => {
    game.move(0, 0);
    game.render({ x: 0, y: 0 });

    const cellsDrawn = logSpy.mock.calls[0].slice(1);

    expect(cellsDrawn.includes("#")).toBeFalsy();
    expect(cellsDrawn.includes("x")).toBeTruthy();
  });

  it("throws when invalid move position", () => {
    expect(() => game.move(-1, 0)).toThrow();
    expect(() => game.move(0, -1)).toThrow();
    expect(() => game.move(3, 0)).toThrow();
    expect(() => game.move(0, 3)).toThrow();
  });

  it("throws when position is taken", () => {
    expect(() => game.move(0, 0).move(0, 0)).toThrow();
  });

  it("throws when game is already over", () => {
    expect(() =>
      game.move(0, 0).move(0, 1).move(1, 1).move(0, 2).move(2, 2).move(1, 0)
    ).toThrow("Game already completed");
  });

  it("throws when index is out of bounds", () => {
    expect(() => game.moveAtIndex(-1)).toThrow();
    expect(() => game.moveAtIndex(9)).toThrow();
  });

  it("correctly finds row winner", () => {
    // Setup moves for a top row win for X
    game.move(0, 0).move(0, 1).move(1, 0).move(0, 2).move(2, 0);

    expect(game.winner).toBe(Winner.X);
  });

  it("correctly finds column winner", () => {
    // Setup moves for a second column win for O
    game.move(0, 0).move(1, 0).move(0, 1).move(1, 1).move(2, 0).move(1, 2);

    expect(game.winner).toBe(Winner.O);
  });

  it("correctly finds diagonal winner", () => {
    // Setup moves for a diagonal X win
    game.move(0, 0).move(1, 0).move(1, 1).move(2, 1).move(2, 2);

    expect(game.winner).toBe(Winner.X);
  });

  it("correctly finds tie", () => {
    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((i) => game.moveAtIndex(i));
    expect(game.winner).toBe(Winner.TIE);
  });

  it("makes winning move", () => {
    // Should play winning move for X
    game.move(0, 0).move(1, 1).move(0, 1).move(1, 0).autoMove();

    expect(game.winner).toBe(Winner.X);
  });

  // Since ideal tic tac toe play results in a tie
  it("should tie when only auto move is played", () => {
    game
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove()
      .autoMove();

    expect(game.winner).toBe(Winner.TIE);
  });
});
