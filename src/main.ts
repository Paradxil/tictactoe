import { TicTacToe } from "./game";
import * as readline from "readline";
import { stdout, stdin } from "process";

const reader = readline.createInterface(stdin, stdout);
const game = new TicTacToe();

console.clear();

console.log("Tic Tac Toe");

game.render();

reader.question("Name: ", (answer) => {
  console.log(answer);
});
