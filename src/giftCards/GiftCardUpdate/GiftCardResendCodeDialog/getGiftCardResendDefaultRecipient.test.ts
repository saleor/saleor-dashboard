import { GiftCardEventsEnum } from "@dashboard/graphql";

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

  it("returns empty recipient when the card was already used", () => {
    // Arrange
    const giftCard = {
      lastUsedOn: "2024-01-01",
      createdByEmail: "buyer@example.com",
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: null,
      name: null,
    });
  });

  it("returns the latest delivery email for unused cards", () => {
    // Arrange
    const giftCard = {
      lastUsedOn: null,
      createdByEmail: "staff@example.com",
      events: [
        {
          type: GiftCardEventsEnum.SENT_TO_CUSTOMER,
          email: "recipient@example.com",
        },
        {
          type: GiftCardEventsEnum.RESENT,
          email: "updated-recipient@example.com",
        },
      ],
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: "updated-recipient@example.com",
      name: null,
    });
  });

  it("returns creator email when no delivery event exists", () => {
    // Arrange
    const giftCard = {
      lastUsedOn: null,
      createdByEmail: "buyer@example.com",
      events: [],
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: "buyer@example.com",
      name: null,
    });
  });

  it("returns creator name when only a user reference exists", () => {
    // Arrange
    const giftCard = {
      lastUsedOn: null,
      createdByEmail: null,
      createdBy: { firstName: "Jane", lastName: "Doe" },
      events: [],
    } as GiftCardForResend;

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: null,
      name: "Jane Doe",
    });
  });
});
