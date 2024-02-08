import { Rule } from "@dashboard/discounts/models";
import {
  ChannelFragment,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

export const channels = [
  // Apollo mocks only work with test channel
  // oif you want to use different channel, you need to update mocks
  {
    currencyCode: "$",
    id: "Q2hhbm5lcDoy",
    name: "Test",
    slug: "test",
    isActive: true,
  },
] as ChannelFragment[];

export const catalogRules = [
  {
    id: "cat-1",
    name: "Catalog rule 1",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "product",
        type: "is",
        value: [
          { label: "Product-1", value: "prod-1" },
          { label: "Product-2", value: "prod-2" },
        ],
      },
      {
        id: "category",
        type: "is",
        value: [{ label: "Category-2", value: "cat-2" }],
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
  {
    id: "cat-2",
    name: "Catalog rule 2",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "category",
        type: "is",
        value: [{ label: "Category-1", value: "cat-1" }],
      },
    ],
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValue: 34,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
] as Rule[];

export const catalogComplexRules = [
  ...catalogRules,
  {
    id: "cat-3",
    name: "Catalog rule 3",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    hasPredicateNestedConditions: true,
    conditions: [
      {
        id: "product",
        type: "is",
        value: [
          { label: "Product-1", value: "prod-1" },
          { label: "Product-2", value: "prod-2" },
        ],
      },
      {
        id: "category",
        type: "is",
        value: [{ label: "Category-2", value: "cat-2" }],
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
] as Rule[];

export const orderRules = [
  {
    id: "order-1",
    name: "Order rule 1",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "baseSubtotalPrice",
        type: "greater",
        value: "33",
      },
      {
        id: "baseTotalPrice",
        type: "greater",
        value: "55",
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
  {
    id: "order-2",
    name: "order rule 2",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "baseSubtotalPrice",
        type: "between",
        value: ["33", "44"],
      },
      {
        id: "baseTotalPrice",
        type: "between",
        value: ["33", "44"],
      },
    ],
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValue: 34,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
] as Rule[];

export const orderComplexRules = [
  ...orderRules,
  {
    id: "order-3",
    name: "Order rule 3",
    description: "",
    hasPredicateNestedConditions: true,
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "baseSubtotalPrice",
        type: "greater",
        value: "33",
      },
      {
        id: "baseTotalPrice",
        type: "greater",
        value: "55",
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
] as Rule[];
