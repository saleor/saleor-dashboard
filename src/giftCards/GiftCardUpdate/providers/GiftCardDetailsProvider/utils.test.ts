import moment from "moment";

import { getExtendedGiftCard, isDefinedExtendedGiftCard } from "./utils";

describe("getExtendedGiftCard", () => {
  it("should return undefined when gift card is undefined", () => {
    // Arrange
    const giftCard = undefined;

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBeUndefined();
  });

  it("should return extended gift card with isExpired false when no expiry date", () => {
    // Arrange
    const giftCard = {
      expiryDate: null,
      id: "test-id",
    };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBeDefined();
    expect(result?.isExpired).toBe(false);
    expect(result?.id).toBe("test-id");
  });

  it("should return extended gift card with isExpired true when expiry date is in the past", () => {
    // Arrange
    const pastDate = moment().subtract(1, "day").format("YYYY-MM-DD");
    const giftCard = {
      expiryDate: pastDate,
      id: "test-id",
    };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBeDefined();
    expect(result?.isExpired).toBe(true);
  });

  it("should return extended gift card with isExpired false when expiry date is in the future", () => {
    // Arrange
    const futureDate = moment().add(1, "day").format("YYYY-MM-DD");
    const giftCard = {
      expiryDate: futureDate,
      id: "test-id",
    };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBeDefined();
    expect(result?.isExpired).toBe(false);
  });
});

describe("isDefinedExtendedGiftCard", () => {
  it("should return false for undefined", () => {
    // Arrange
    const giftCard = undefined;

    // Act
    const result = isDefinedExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBe(false);
  });

  it("should return true for defined gift card", () => {
    // Arrange
    const giftCard = {
      expiryDate: null,
      id: "test-id",
      isExpired: false,
    };

    // Act
    const result = isDefinedExtendedGiftCard(giftCard);

    // Assert
    expect(result).toBe(true);
  });
});
