import { prompt } from "./prompt";
import * as Prompt from "./prompt";

describe("promt", () => {
  let logSpy: jest.SpyInstance;
  let keyPressSpy: jest.SpyInstance;

  beforeEach(() => {
    keyPressSpy = jest.spyOn(Prompt, "nextKeyPress").mockResolvedValue("space");
    logSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders question", async () => {
    await prompt("Question?", ["option 1", "option 2"]);

    expect(logSpy).toHaveBeenCalledWith("Question?");
    expect(logSpy).toHaveBeenCalledWith("> option 1");
    expect(logSpy).toHaveBeenCalledWith("  option 2");
  });

  it("returns selected option", async () => {
    // Move the cursor down one then use space to select.
    let keyPressCount = 0;
    keyPressSpy.mockImplementation(() => {
      if (keyPressCount) {
        return "space";
      }

      keyPressCount += 1;
      return "down";
    });

    const result = await prompt("Question?", ["option 1", "option 2"]);

    expect(logSpy).toHaveBeenCalledWith("> option 2");
    expect(result).toBe("option 2");
  });

  it("does not permit selecting invalid options", async () => {
    // Move the cursor down several times then back up
    let keyPressCount = 0;
    keyPressSpy.mockImplementation(() => {
      keyPressCount += 1;

      if (keyPressCount > 5) {
        return "return";
      }
      if (keyPressCount > 2) {
        return "w";
      }
      return "s";
    });

    const result = await prompt("Question?", ["option 1", "option 2"]);

    expect(logSpy).toHaveBeenCalledWith("> option 2");
    expect(result).toBe("option 1");
  });
});
