import { getGiftCardResendDefaultRecipient } from "./getGiftCardResendDefaultRecipient";

type GiftCardForResend = Parameters<typeof getGiftCardResendDefaultRecipient>[0];

describe("getGiftCardResendDefaultRecipient", () => {
  it("returns empty recipient when gift card is missing", () => {
    // Arrange // Act
    const result = getGiftCardResendDefaultRecipient(null);

    // Assert
    expect(result).toEqual({
      email: null,
      name: null,
    });
  });

  it("returns used-by email when the card has been used", () => {
    // Arrange
    const giftCard = {
      usedByEmail: "used@example.com",
      createdByEmail: "buyer@example.com",
      lastUsedOn: "2024-01-01",
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: "used@example.com",
      name: null,
    });
  });

  it("returns creator email when the card has not been used", () => {
    // Arrange
    const giftCard = {
      usedByEmail: null,
      createdByEmail: "buyer@example.com",
      lastUsedOn: null,
      createdBy: { firstName: "Jane", lastName: "Doe" },
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: "buyer@example.com",
      name: "Jane Doe",
    });
  });

  it("falls back to used-by name when only a user reference exists", () => {
    // Arrange
    const giftCard = {
      usedBy: { firstName: "John", lastName: "Appleseed" },
      usedByEmail: null,
      lastUsedOn: "2024-01-01",
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: null,
      name: "John Appleseed",
    });
  });
});
