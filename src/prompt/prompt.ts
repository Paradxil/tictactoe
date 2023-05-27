import { stdin } from "process";

// Waits for the users next keypress
export const nextKeyPress = async (): Promise<string> =>
  new Promise((resolve) => {
    stdin.once("keypress", (_char, key) => {
      resolve(key.name);
    });
  });

const selectKeys = ["return", "space"];

// Simple utility to let a user select an option in the terminal
// Would likely be better to use an existing npm package here.
export const prompt = async <T = string>(
  question: string,
  options: T[]
): Promise<T> => {
  let currentOption = 0;
  let key: string;

  do {
    console.clear();
    console.log(question);

    options.forEach((option, i) => {
      console.log(`${i === currentOption ? ">" : " "} ${option}`);
    });

    key = await nextKeyPress();

    switch (key) {
      case "w":
      case "up":
        currentOption -= 1;
        break;
      case "s":
      case "down":
        currentOption += 1;
        break;
    }

    if (currentOption < 0) {
      currentOption = 0;
    }

    if (currentOption >= options.length) {
      currentOption = options.length - 1;
    }
  } while (!selectKeys.includes(key));

  return options[currentOption];
};
