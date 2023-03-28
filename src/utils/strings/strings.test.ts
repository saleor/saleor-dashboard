import { getBooleanFromString } from "./strings";

describe("getBooleanFromString", () => {
  it('should return true when value is "true"', () => {
    expect(getBooleanFromString("true")).toBe(true);
  });

  it('should return false when value is "false"', () => {
    expect(getBooleanFromString("false")).toBe(false);
  });

  it('should return undefined when value is not "true" or "false"', () => {
    expect(getBooleanFromString("")).toBe(undefined);
    expect(getBooleanFromString("foo")).toBe(undefined);
    expect(getBooleanFromString("true ")).toBe(undefined);
    expect(getBooleanFromString(" false")).toBe(undefined);
  });
});
