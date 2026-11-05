import { DiscountTypeEnum } from "./types";
import {
  getDiscountValueIssue,
  getMinSpentIssue,
  getWholeNumberIssue,
} from "./voucherValueValidation";

describe("getDiscountValueIssue", () => {
  it.each([
    { value: "", expected: "required" },
    { value: null, expected: "required" },
    { value: "0", expected: "notPositive" },
    { value: "-0.5", expected: "notPositive" },
    { value: "100.01", expected: "aboveHundredPercent" },
    { value: "120", expected: "aboveHundredPercent" },
    { value: "0.0001", expected: "tooManyDecimals" },
    { value: "0.000001", expected: "tooManyDecimals" },
    { value: "1e-10", expected: "tooManyDecimals" },
    { value: "0.001", expected: null },
    { value: "12.125", expected: null },
    { value: "100", expected: null },
  ])("treats a percentage of $value as $expected", ({ value, expected }) => {
    // Arrange & Act
    const issue = getDiscountValueIssue(value, DiscountTypeEnum.VALUE_PERCENTAGE);

    // Assert
    expect(issue).toBe(expected);
  });

  it.each([
    { value: "", expected: "required" },
    { value: "0", expected: "notPositive" },
    { value: "120", expected: null },
    { value: "10.25", expected: null },
  ])("treats a fixed amount of $value as $expected", ({ value, expected }) => {
    // Arrange & Act
    const issue = getDiscountValueIssue(value, DiscountTypeEnum.VALUE_FIXED);

    // Assert
    expect(issue).toBe(expected);
  });
});

describe("getWholeNumberIssue", () => {
  it.each([
    { value: "", expected: "required" },
    { value: "1.5", expected: "notWhole" },
    { value: 7.5, expected: "notWhole" },
    { value: "0", expected: "belowOne" },
    { value: "-2", expected: "belowOne" },
    { value: "3000000000", expected: "tooLarge" },
    { value: "1", expected: null },
    { value: 12, expected: null },
  ])("treats $value as $expected", ({ value, expected }) => {
    // Arrange & Act
    const issue = getWholeNumberIssue(value);

    // Assert
    expect(issue).toBe(expected);
  });
});

describe("getMinSpentIssue", () => {
  it.each([
    { value: "", expected: "required" },
    { value: "-0.5", expected: "negative" },
    { value: "0", expected: null },
    { value: "25.50", expected: null },
  ])("treats $value as $expected", ({ value, expected }) => {
    // Arrange & Act
    const issue = getMinSpentIssue(value);

    // Assert
    expect(issue).toBe(expected);
  });
});
