import { Cell } from "../types";
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

  it("throws when invalid move position", () => {
    expect(() => game.move(-1, 0, Cell.X)).toThrow();
    expect(() => game.move(0, -1, Cell.X)).toThrow();
    expect(() => game.move(3, 0, Cell.X)).toThrow();
    expect(() => game.move(0, 3, Cell.X)).toThrow();
  });

  it("throws when position is taken", () => {
    expect(() => game.move(0, 0, Cell.X).move(0, 0, Cell.O)).toThrow();
  });
});
