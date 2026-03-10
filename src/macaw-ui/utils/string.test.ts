import { isStringArray } from "./string";

describe("isStringArray", () => {
  it("should return true for an array of strings", () => {
    expect(isStringArray(["hello", "world"])).toBe(true);
  });

  it("should return false for an empty array", () => {
    expect(isStringArray([])).toBe(false);
  });

  it("should return false for an array of non-strings", () => {
    expect(
      isStringArray([
        { value: "two", label: "two" },
        { value: "one", label: "one" },
      ])
    ).toBe(false);
  });

  it("should return false for a non-array value", () => {
    expect(isStringArray("hello")).toBe(false);
  });
});
