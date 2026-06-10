import { DiscountRulesContextProvider } from "@dashboard/discounts/components/DiscountRules/context";
import { type Rule } from "@dashboard/discounts/models";
import {
  AllocationStrategyEnum,
  type ChannelFragment,
  PromotionTypeEnum,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { RulesList } from "./RulesList";

const channel: ChannelFragment = {
  __typename: "Channel",
  id: "Q2hhbm5lbDox",
  isActive: true,
  name: "US Store",
  slug: "us-store",
  currencyCode: "USD",
  defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
  },
};

const inactiveChannel: ChannelFragment = {
  ...channel,
  id: "Q2hhbm5lbDoy",
  isActive: false,
  name: "EU Store",
  slug: "eu-store",
  currencyCode: "EUR",
};

const makeProducts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    label: `Product ${i + 1}`,
    value: `UHJvZHVjdDox${i}`,
  }));

const ruleWithFewProducts: Rule = {
  id: "rule-1",
  name: "Summer sale",
  description: null,
  channel: { label: "US Store", value: "Q2hhbm5lbDox" },
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardValue: 10,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  rewardGifts: [],
  conditions: [
    {
      id: "product",
      type: "is",
      value: [
        { label: "Apple Juice", value: "UHJvZHVjdDox0" },
        { label: "Monospace Tee", value: "UHJvZHVjdDox1" },
      ],
    },
  ],
};

const ruleWithOverflow: Rule = {
  id: "rule-2",
  name: "Big catalog promo",
  description: null,
  channel: { label: "US Store", value: "Q2hhbm5lbDox" },
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardValue: 25,
  rewardValueType: RewardValueTypeEnum.FIXED,
  rewardGifts: [],
  conditions: [
    {
      id: "product",
      type: "is",
      value: [
        ...makeProducts(7),
        { label: "Very Long Product Name That Should Get Truncated", value: "UHJvZHVjdDoxLong" },
      ],
    },
    {
      id: "category",
      type: "is",
      value: [
        { label: "Apparel", value: "Q2F0ZWdvcnkx" },
        { label: "Accessories", value: "Q2F0ZWdvcnky" },
      ],
    },
  ],
};

const ruleWithMixedConditions: Rule = {
  id: "rule-3",
  name: "Mixed conditions",
  description: null,
  channel: { label: "US Store", value: "Q2hhbm5lbDox" },
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardValue: 15,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  rewardGifts: [],
  conditions: [
    {
      id: "product",
      type: "is",
      value: [{ label: "Sneakers", value: "UHJvZHVjdDoxSnk" }],
    },
    {
      id: "collection",
      type: "is",
      value: [
        { label: "Summer Collection", value: "Q29sbGVjdGlvbjox" },
        { label: "Outlet", value: "Q29sbGVjdGlvbjoy" },
      ],
    },
    {
      id: "variant",
      type: "is",
      value: [
        { label: "Blue / XL", value: "UHJvZHVjdFZhcmlhbnQx" },
        { label: "Red / M", value: "UHJvZHVjdFZhcmlhbnQy" },
        { label: "Green / S", value: "UHJvZHVjdFZhcmlhbnQz" },
        { label: "Black / L", value: "UHJvZHVjdFZhcmlhbnQ0" },
      ],
    },
  ],
};

const ruleWithNoConditions: Rule = {
  id: "rule-4",
  name: "Blanket discount",
  description: null,
  channel: { label: "US Store", value: "Q2hhbm5lbDox" },
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardValue: 5,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  rewardGifts: [],
  conditions: [],
};

const ruleWithNestedConditions: Rule = {
  id: "rule-5",
  name: "Complex conditions",
  description: null,
  channel: { label: "US Store", value: "Q2hhbm5lbDox" },
  rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
  rewardValue: 20,
  rewardValueType: RewardValueTypeEnum.FIXED,
  rewardGifts: [],
  conditions: [],
  hasPredicateNestedConditions: true,
};

const ruleWithInactiveChannel: Rule = {
  ...ruleWithFewProducts,
  id: "rule-6",
  name: "EU promo",
  channel: { label: "EU Store", value: "Q2hhbm5lbDoy" },
};

const meta: Meta<typeof RulesList> = {
  title: "Discounts / RulesList",
  component: RulesList,
  decorators: [
    (Story: StoryFn) => (
      <DiscountRulesContextProvider
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[channel, inactiveChannel]}
        disabled={false}
      >
        <Story />
      </DiscountRulesContextProvider>
    ),
  ],
  args: {
    errors: [],
    onRuleDelete: fn(),
    onRuleEdit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RulesList>;

export const FewProducts: Story = {
  args: {
    rules: [ruleWithFewProducts],
  },
};

export const WithOverflow: Story = {
  args: {
    rules: [ruleWithOverflow],
  },
};

export const MixedConditionTypes: Story = {
  args: {
    rules: [ruleWithMixedConditions],
  },
};

export const MultipleRules: Story = {
  args: {
    rules: [ruleWithFewProducts, ruleWithOverflow, ruleWithMixedConditions],
  },
};

export const NoConditions: Story = {
  args: {
    rules: [ruleWithNoConditions],
  },
};

export const ComplexNestedConditions: Story = {
  args: {
    rules: [ruleWithNestedConditions],
  },
};

export const InactiveChannel: Story = {
  args: {
    rules: [ruleWithInactiveChannel],
  },
};

export const Empty: Story = {
  args: {
    rules: [],
  },
};

export const Loading: Story = {
  args: {
    rules: [],
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    rules: [ruleWithFewProducts],
    errors: [{ code: "INVALID", message: "Error", field: null, index: 0 }],
  },
};
