import { TicTacToe } from "./game/game";
import * as readline from "readline";
import { stdin } from "process";
import { nextKeyPress, prompt } from "./prompt/prompt";
import { Cell, Winner } from "./types";

readline.emitKeypressEvents(stdin);
stdin.setRawMode(true);

const game = new TicTacToe();
const selection = {
  x: 0,
  y: 0,
};
let message: string = "";

const handleInput = async (player: Cell) => {
  const input = await nextKeyPress();

  switch (input) {
    case "d":
    case "right":
      selection.x += 1;
      break;
    case "a":
    case "left":
      selection.x -= 1;
      break;
    case "w":
    case "up":
      selection.y -= 1;
      break;
    case "s":
    case "down":
      selection.y += 1;
      break;
    case "space":
    case "return":
      try {
        game.move(selection.x, selection.y);
        message = "";
      } catch (err) {
        message = err.message;
      }
      break;
    case "q":
      process.exit();
      break;
  }

  selection.x = selection.x >= 0 ? Math.min(selection.x, 2) : 0;
  selection.y = selection.y >= 0 ? Math.min(selection.y, 2) : 0;
};

const run = async () => {
  const playersPiece = await prompt<Cell>("Would you like to play as X or O?", [
    Cell.X,
    Cell.O,
  ]);

  console.clear();

  game.render();

  while (!game.winner) {
    if (game.currentTurn !== playersPiece) {
      game.autoMove();
    }

    console.clear();

    game.render(selection);

    console.log(message);
    console.log("Select a cell with Arrow Keys or WASD.");
    console.log("Enter or Space to continue.");
    console.log("Q to exit");

    if (!game.winner) {
      await handleInput(playersPiece);
    }
  }

  console.clear();

  game.render();

  if (game.winner === Winner.TIE) {
    console.log(`\nIt was a tie!\n`);
  } else {
    console.log(`\n${game.winner} won the game!\n`);
  }

  process.exit();
};

run();
