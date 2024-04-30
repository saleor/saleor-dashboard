import { toFixed } from "./toFixed";

describe("toFixed", () => {
  test("should return empty string if num is empty", () => {
    expect(toFixed("", 2)).toBe("");
  });
  test("should return number with fixed decimal places", () => {
    expect(toFixed("1.234567", 2)).toBe("1.23");
    expect(toFixed("1.234567", 3)).toBe("1.234");
    expect(toFixed("1.234567", 0)).toBe("1");
    expect(toFixed("1.234567", 1)).toBe("1.2");
  });
});
