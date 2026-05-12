import { roundMoneyAmount } from "./index";

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
