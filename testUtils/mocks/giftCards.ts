import { ExtendedGiftCard } from "../../src/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { GiftCardDetailsQuery } from "../../src/graphql";

export const giftCardsMocks: ExtendedGiftCard<NonNullable<GiftCardDetailsQuery["giftCard"]>>[] = [
  {
    __typename: "GiftCard",
    isExpired: false,
    last4CodeChars: "1234",
    boughtInChannel: "online",
    usedByEmail: "user@example.com",
    createdByEmail: "creator@example.com",
    created: new Date().toISOString(),
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    lastUsedOn: new Date().toISOString(),
    isActive: true,
    id: "giftCardId123",
    createdBy: {
      __typename: "User",
      id: "userId123",
      firstName: "John",
      lastName: "Doe",
    },
    product: {
      __typename: "Product",
      id: "productId123",
      name: "Product Name",
    },
    usedBy: {
      __typename: "User",
      id: "userId456",
      firstName: "Jane",
      lastName: "Smith",
    },
    initialBalance: {
      __typename: "Money",
      amount: 100,
      currency: "USD",
    },
    currentBalance: {
      __typename: "Money",
      amount: 50,
      currency: "USD",
    },
    tags: [
      { __typename: "GiftCardTag", name: "Birthday" },
      { __typename: "GiftCardTag", name: "Anniversary" },
    ],
    metadata: [
      { __typename: "MetadataItem", key: "key1", value: "value1" },
      { __typename: "MetadataItem", key: "key2", value: "value2" },
    ],
    privateMetadata: [
      { __typename: "MetadataItem", key: "privateKey1", value: "privateValue1" },
      { __typename: "MetadataItem", key: "privateKey2", value: "privateValue2" },
    ],
  },
];
