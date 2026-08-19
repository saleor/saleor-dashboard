import { GiftCardEventsEnum } from "@dashboard/graphql";

import {
  giftCardBoughtByEmailFixture,
  giftCardBoughtPartialFixture,
  giftCardIssuedByAppFixture,
  giftCardIssuedUnusedFixture,
} from "../fixtures";
import {
  getGiftCardProvenanceActor,
  getGiftCardProvenanceOrder,
} from "./getGiftCardProvenanceFields";
import { giftCardProvenanceCardMessages as messages } from "./messages";

describe("getGiftCardProvenanceActor", () => {
  it("returns staff issuer for ISSUED events without an app", () => {
    // Arrange / Act
    const actor = getGiftCardProvenanceActor(giftCardIssuedUnusedFixture);

    // Assert
    expect(actor.label).toBe(messages.issuedByLabel);
    expect(actor.name).toBe("Ada Admin");
    expect(actor.url).toContain("staff-1");
    expect(actor.icon).toBe("staff");
  });

  it("prefers giftCard.app when the ISSUED event has no app payload", () => {
    // Arrange
    const giftCard = {
      ...giftCardIssuedByAppFixture,
      events: giftCardIssuedByAppFixture.events.map(event =>
        event.type === GiftCardEventsEnum.ISSUED ? { ...event, app: null } : event,
      ),
    };

    // Act
    const actor = getGiftCardProvenanceActor(giftCard);

    // Assert
    expect(actor.label).toBe(messages.issuedByAppLabel);
    expect(actor.name).toBe("Loyalty Bridge");
    expect(actor.icon).toBe("app");
  });

  it("returns buyer for storefront purchases", () => {
    // Arrange / Act
    const actor = getGiftCardProvenanceActor(giftCardBoughtPartialFixture);

    // Assert
    expect(actor.label).toBe(messages.boughtByLabel);
    expect(actor.name).toBe("Sam Buyer");
    expect(actor.url).toContain("customer-1");
    expect(actor.copyText).toBe("buyer@example.com");
    expect(actor.icon).toBe("user");
  });

  it("returns guest email without a customer link", () => {
    // Arrange / Act
    const actor = getGiftCardProvenanceActor(giftCardBoughtByEmailFixture);

    // Assert
    expect(actor.label).toBe(messages.boughtByLabel);
    expect(actor.name).toBe("Joesph_Wisoky92@example.com");
    expect(actor.url).toBeUndefined();
    expect(actor.copyText).toBe("Joesph_Wisoky92@example.com");
    expect(actor.icon).toBe("mail");
  });
});

describe("getGiftCardProvenanceOrder", () => {
  it("returns the bought order when present", () => {
    // Arrange / Act
    const order = getGiftCardProvenanceOrder(giftCardBoughtPartialFixture);

    // Assert
    expect(order?.text).toBe("#276");
    expect(order?.link).toContain("T3JkZXI6Mjc2");
  });

  it("returns null when there is no order on events", () => {
    // Arrange / Act
    const order = getGiftCardProvenanceOrder(giftCardIssuedUnusedFixture);

    // Assert
    expect(order).toBeNull();
  });
});
