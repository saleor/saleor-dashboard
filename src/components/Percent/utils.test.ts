import { Locale } from "../Locale";
import { formatPercantage } from "./utils";

describe("formatPercantage", () => {
  it('should return "-" when amount is 0', () => {
    expect(formatPercantage(0, Locale.EN)).toBe("-");
  });
  it('should return "-" when amount is undefined', () => {
    expect(formatPercantage(undefined, Locale.EN)).toBe("-");
  });
  it("should return percantage when amount is provided", () => {
    expect(formatPercantage(33, Locale.EN)).toBe("33%");
    expect(formatPercantage(33.1233, Locale.EN)).toBe("33.12%");
  });
});
