import { getTruncatedTextValue } from "./utils";

describe("getTruncatedTextValue", () => {
  it("should truncate the value if it is longer than the specified length", () => {
    expect(getTruncatedTextValue("Hello, world!", 5)).toBe("Hello...");
  });

  it("should return the value if it is shorter than the specified length", () => {
    expect(getTruncatedTextValue("Hello", 10)).toBe("Hello");
  });

  it("should return the value if it is exactly the specified length", () => {
    expect(getTruncatedTextValue("Hello", 5)).toBe("Hello");
  });

  it("should return the value if it is empty", () => {
    expect(getTruncatedTextValue("", 5)).toBe("");
  });
});
