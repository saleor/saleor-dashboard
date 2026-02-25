import { type GiftCardBase } from "./types";
import { getExtendedGiftCard } from "./utils";

describe("getExtendedGiftCard", () => {
  it("marks gift card with past expiry date as expired", () => {
    // Arrange
    const giftCard: GiftCardBase = { expiryDate: "2020-01-01" };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result?.isExpired).toBe(true);
  });

  it("marks gift card with future expiry date as not expired", () => {
    // Arrange
    const giftCard: GiftCardBase = { expiryDate: "2099-01-01" };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result?.isExpired).toBe(false);
  });

  it("marks gift card with null expiry date as not expired", () => {
    // Arrange
    const giftCard: GiftCardBase = { expiryDate: null };

    // Act
    const result = getExtendedGiftCard(giftCard);

    // Assert
    expect(result?.isExpired).toBe(false);
  });

  it("returns undefined for undefined input", () => {
    // Act
    const result = getExtendedGiftCard(undefined);

    // Assert
    expect(result).toBeUndefined();
  });
});
