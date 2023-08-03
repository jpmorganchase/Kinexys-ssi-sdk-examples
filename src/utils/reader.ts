import * as readline from "readline";

export const readFromUserInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
