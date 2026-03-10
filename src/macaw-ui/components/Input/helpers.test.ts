import { isInputTyped } from "./helpers";

describe("Input helpers: isInputTyped", () => {
  it("should retrn true if type is date", () => {
    expect(isInputTyped("date", "", false)).toBe(true);
  });

  it("should retrn false when value is empty string", () => {
    expect(isInputTyped("text", "", false)).toBe(false);
  });

  it("retrn false when value is undefined", () => {
    expect(isInputTyped("text", undefined, false)).toBe(false);
  });

  it("should retrn true if is active", () => {
    expect(isInputTyped("text", "", true)).toBe(true);
  });
});
