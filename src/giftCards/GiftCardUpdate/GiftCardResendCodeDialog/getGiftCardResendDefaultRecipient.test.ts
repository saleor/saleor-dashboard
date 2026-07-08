import { GiftCardEventsEnum } from "@dashboard/graphql";

import {
  getGiftCardResendDefaultRecipient,
  type GiftCardResendRecipientInput,
} from "./getGiftCardResendDefaultRecipient";

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
    const giftCard: GiftCardResendRecipientInput = {
      lastUsedOn: "2024-01-01",
      createdByEmail: "buyer@example.com",
      createdBy: null,
      events: [],
    };

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
    const giftCard: GiftCardResendRecipientInput = {
      lastUsedOn: null,
      createdByEmail: "staff@example.com",
      createdBy: null,
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
    };

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
    const giftCard: GiftCardResendRecipientInput = {
      lastUsedOn: null,
      createdByEmail: "buyer@example.com",
      createdBy: null,
      events: [],
    };

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
    const giftCard: GiftCardResendRecipientInput = {
      lastUsedOn: null,
      createdByEmail: null,
      createdBy: { firstName: "Jane", lastName: "Doe" },
      events: [],
    };

    // Act
    const result = getGiftCardResendDefaultRecipient(giftCard);

    // Assert
    expect(result).toEqual({
      email: null,
      name: "Jane Doe",
    });
  });
});
