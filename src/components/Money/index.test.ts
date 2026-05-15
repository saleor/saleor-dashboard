import { roundMoneyAmount, roundMoneyByDigits } from "./index";

describe("roundMoneyByDigits", () => {
  it("rounds to the given number of fraction digits (half away from zero)", () => {
    // Arrange / Act / Assert
    expect(roundMoneyByDigits(1.234, 2)).toBe(1.23);
    expect(roundMoneyByDigits(1.235, 2)).toBe(1.24);
    expect(roundMoneyByDigits(0.1 + 0.2, 2)).toBe(0.3);
  });

  it("supports 0 fraction digits (e.g. JPY)", () => {
    // Arrange / Act / Assert
    expect(roundMoneyByDigits(123.4, 0)).toBe(123);
    expect(roundMoneyByDigits(123.5, 0)).toBe(124);
  });

  it("supports 3 fraction digits (e.g. BHD)", () => {
    // Arrange / Act / Assert
    expect(roundMoneyByDigits(1.2345, 3)).toBe(1.235);
    expect(roundMoneyByDigits(1.2344, 3)).toBe(1.234);
  });

  it("preserves negative amounts", () => {
    // Arrange / Act / Assert
    expect(roundMoneyByDigits(-1.234, 2)).toBe(-1.23);
    expect(roundMoneyByDigits(-1.236, 2)).toBe(-1.24);
  });
});

describe("roundMoneyAmount", () => {
  it("rounds USD to 2 decimals", () => {
    expect(roundMoneyAmount(1.234, "USD")).toBe(1.23);
    expect(roundMoneyAmount(1.235, "USD")).toBe(1.24);
    expect(roundMoneyAmount(0.1 + 0.2, "USD")).toBe(0.3);
  });

  it("rounds JPY to 0 decimals", () => {
    expect(roundMoneyAmount(123.4, "JPY")).toBe(123);
    expect(roundMoneyAmount(123.5, "JPY")).toBe(124);
  });

  it("rounds BHD to 3 decimals", () => {
    expect(roundMoneyAmount(1.2345, "BHD")).toBe(1.235);
    expect(roundMoneyAmount(1.2344, "BHD")).toBe(1.234);
  });

  it("falls back to 2 decimals for unknown currencies", () => {
    expect(roundMoneyAmount(1.234, "INVALID")).toBe(1.23);
  });

  it("preserves negative amounts", () => {
    expect(roundMoneyAmount(-1.234, "USD")).toBe(-1.23);
    expect(roundMoneyAmount(-1.236, "USD")).toBe(-1.24);
  });
});
