import { TimePeriodTypeEnum } from "@dashboard/graphql";

import { type GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import { getExpiryPeriodTerminationDate, getGiftCardExpiryInputData } from "./utils";

const FIXED_DATE = new Date("2024-01-15T00:00:00Z").getTime();

describe("getExpiryPeriodTerminationDate", () => {
  it("adds days correctly", () => {
    // Arrange
    const amount = 30;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, TimePeriodTypeEnum.DAY, amount);

    // Assert
    expect(result?.format("YYYY-MM-DD")).toBe("2024-02-14");
  });

  it("adds weeks correctly", () => {
    // Arrange
    const amount = 2;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, TimePeriodTypeEnum.WEEK, amount);

    // Assert
    expect(result?.format("YYYY-MM-DD")).toBe("2024-01-29");
  });

  it("adds months correctly", () => {
    // Arrange
    const amount = 3;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, TimePeriodTypeEnum.MONTH, amount);

    // Assert
    expect(result?.format("YYYY-MM-DD")).toBe("2024-04-15");
  });

  it("adds years correctly", () => {
    // Arrange
    const amount = 1;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, TimePeriodTypeEnum.YEAR, amount);

    // Assert
    expect(result?.format("YYYY-MM-DD")).toBe("2025-01-15");
  });

  it("returns null for unknown period type", () => {
    // Arrange
    const unknownType = "UNKNOWN" as TimePeriodTypeEnum;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, unknownType, 5);

    // Assert
    expect(result).toBeNull();
  });

  it("returns same date when amount is 0", () => {
    // Arrange
    const amount = 0;

    // Act
    const result = getExpiryPeriodTerminationDate(FIXED_DATE, TimePeriodTypeEnum.DAY, amount);

    // Assert
    expect(result?.format("YYYY-MM-DD")).toBe("2024-01-15");
  });
});

describe("getGiftCardExpiryInputData", () => {
  const baseFormData: GiftCardCreateCommonFormData = {
    expirySelected: true,
    expiryType: "EXPIRY_DATE",
    expiryDate: "2025-06-01",
    expiryPeriodAmount: 30,
    expiryPeriodType: TimePeriodTypeEnum.DAY,
    requiresActivation: false,
    tags: [],
    balanceAmount: 100,
    balanceCurrency: "USD",
  };

  it("returns undefined when expirySelected is false", () => {
    // Arrange
    const formData: GiftCardCreateCommonFormData = {
      ...baseFormData,
      expirySelected: false,
    };

    // Act
    const result = getGiftCardExpiryInputData(formData, FIXED_DATE);

    // Assert
    expect(result).toBeUndefined();
  });

  it("returns expiryDate when expiryType is EXPIRY_DATE", () => {
    // Arrange
    const formData: GiftCardCreateCommonFormData = {
      ...baseFormData,
      expiryType: "EXPIRY_DATE",
      expiryDate: "2025-06-01",
    };

    // Act
    const result = getGiftCardExpiryInputData(formData, FIXED_DATE);

    // Assert
    expect(result).toBe("2025-06-01");
  });

  it("returns computed future date for EXPIRY_PERIOD with DAY", () => {
    // Arrange
    const formData: GiftCardCreateCommonFormData = {
      ...baseFormData,
      expiryType: "EXPIRY_PERIOD",
      expiryPeriodType: TimePeriodTypeEnum.DAY,
      expiryPeriodAmount: 30,
    };

    // Act
    const result = getGiftCardExpiryInputData(formData, FIXED_DATE);

    // Assert
    expect(result).toBe("2024-02-14");
  });

  it("returns computed future date for EXPIRY_PERIOD with MONTH", () => {
    // Arrange
    const formData: GiftCardCreateCommonFormData = {
      ...baseFormData,
      expiryType: "EXPIRY_PERIOD",
      expiryPeriodType: TimePeriodTypeEnum.MONTH,
      expiryPeriodAmount: 6,
    };

    // Act
    const result = getGiftCardExpiryInputData(formData, FIXED_DATE);

    // Assert
    expect(result).toBe("2024-07-15");
  });
});
