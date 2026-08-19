import { type GiftCardDetailsQuery, GiftCardEventsEnum } from "@dashboard/graphql";

import { type ExtendedGiftCard } from "./providers/GiftCardDetailsProvider/types";

type GiftCardDetails = NonNullable<GiftCardDetailsQuery["giftCard"]>;

export type GiftCardDetailsFixture = ExtendedGiftCard<GiftCardDetails>;

const money = (amount: number, currency = "USD") => ({
  __typename: "Money" as const,
  amount,
  currency,
});

const baseGiftCard: GiftCardDetailsFixture = {
  __typename: "GiftCard",
  id: "R2lmdENhcmQ6MQ==",
  code: "ABCD-EFGH-IJKL",
  last4CodeChars: "IJKL",
  displayCode: "XXXX-XXXX-IJKL",
  isActive: true,
  isExpired: false,
  created: "2025-06-01T10:00:00+00:00",
  expiryDate: null,
  lastUsedOn: null,
  boughtInChannel: null,
  createdBy: null,
  createdByEmail: null,
  assignedTo: null,
  assignedToEmail: null,
  app: null,
  product: null,
  tags: [],
  metadata: [],
  privateMetadata: [],
  initialBalance: money(100),
  currentBalance: money(100),
  events: [],
};

/** Staff-issued, unused, never expires. */
export const giftCardIssuedUnusedFixture: GiftCardDetailsFixture = {
  ...baseGiftCard,
  events: [
    {
      __typename: "GiftCardEvent",
      id: "event-issued",
      date: "2025-06-01T10:00:00+00:00",
      type: GiftCardEventsEnum.ISSUED,
      message: null,
      email: null,
      orderId: null,
      orderNumber: null,
      tags: null,
      oldTags: null,
      expiryDate: null,
      oldExpiryDate: null,
      assignedTo: null,
      balance: null,
      app: null,
      user: {
        __typename: "User",
        id: "staff-1",
        email: "admin@example.com",
        firstName: "Ada",
        lastName: "Admin",
        avatar: null,
      },
    },
  ],
  createdBy: {
    __typename: "User",
    id: "staff-1",
    firstName: "Ada",
    lastName: "Admin",
  },
  createdByEmail: "admin@example.com",
};

/** Bought via storefront product; partially spent; expires soon. */
export const giftCardBoughtPartialFixture: GiftCardDetailsFixture = {
  ...baseGiftCard,
  id: "R2lmdENhcmQ6Mg==",
  code: "WXYZ-1234-5678",
  last4CodeChars: "5678",
  boughtInChannel: "channel-usd",
  lastUsedOn: "2026-07-20T14:30:00+00:00",
  expiryDate: "2026-09-01",
  isExpired: false,
  initialBalance: money(100),
  currentBalance: money(42.5),
  product: {
    __typename: "Product",
    id: "UHJvZHVjdDox",
    name: "Gift card 100",
    thumbnail: {
      __typename: "Image",
      url: "https://picsum.photos/seed/giftcard/64",
    },
  },
  createdBy: {
    __typename: "User",
    id: "customer-1",
    firstName: "Sam",
    lastName: "Buyer",
  },
  createdByEmail: "buyer@example.com",
  events: [
    {
      __typename: "GiftCardEvent",
      id: "event-bought",
      date: "2025-06-01T10:00:00+00:00",
      type: GiftCardEventsEnum.BOUGHT,
      message: null,
      email: "buyer@example.com",
      orderId: "T3JkZXI6Mjc2",
      orderNumber: "276",
      tags: null,
      oldTags: null,
      expiryDate: null,
      oldExpiryDate: null,
      assignedTo: null,
      balance: null,
      app: null,
      user: null,
    },
  ],
};

/** Issued by an app; no product/channel. */
export const giftCardIssuedByAppFixture: GiftCardDetailsFixture = {
  ...giftCardIssuedUnusedFixture,
  id: "R2lmdENhcmQ6Mw==",
  createdBy: null,
  createdByEmail: null,
  app: {
    __typename: "App",
    id: "QXBwOjE=",
    name: "Loyalty Bridge",
  },
  events: [
    {
      __typename: "GiftCardEvent",
      id: "event-issued-app",
      date: "2025-06-01T10:00:00+00:00",
      type: GiftCardEventsEnum.ISSUED,
      message: null,
      email: null,
      orderId: null,
      orderNumber: null,
      tags: null,
      oldTags: null,
      expiryDate: null,
      oldExpiryDate: null,
      assignedTo: null,
      balance: null,
      app: {
        __typename: "App",
        id: "QXBwOjE=",
        name: "Loyalty Bridge",
        brand: null,
      },
      user: null,
    },
  ],
};

/** Expired with remaining balance. */
export const giftCardExpiredFixture: GiftCardDetailsFixture = {
  ...giftCardIssuedUnusedFixture,
  id: "R2lmdENhcmQ6NA==",
  isExpired: true,
  expiryDate: "2024-01-01",
  currentBalance: money(25),
  initialBalance: money(50),
};

/** Storefront purchase by guest email (no customer account on createdBy). */
export const giftCardBoughtByEmailFixture: GiftCardDetailsFixture = {
  ...giftCardBoughtPartialFixture,
  id: "R2lmdENhcmQ6NA==",
  createdBy: null,
  createdByEmail: "Joesph_Wisoky92@example.com",
};

/** Restricted by email only (no customer account). */
export const giftCardEmailOnlyAssignFixture: GiftCardDetailsFixture = {
  ...giftCardBoughtPartialFixture,
  id: "R2lmdENhcmQ6NQ==",
  assignedTo: null,
  assignedToEmail: "guest.buyer@example.com",
};

/** Restricted to a customer account. */
export const giftCardAssignedCustomerFixture: GiftCardDetailsFixture = {
  ...giftCardBoughtPartialFixture,
  id: "R2lmdENhcmQ6Ng==",
  assignedToEmail: "sam@example.com",
  assignedTo: {
    __typename: "User",
    id: "customer-1",
    firstName: "Sam",
    lastName: "Buyer",
  },
};

export const giftCardChannelFixture = {
  id: "Q2hhbm5lbDox",
  name: "Channel-USD",
  slug: "channel-usd",
  isActive: true,
};
