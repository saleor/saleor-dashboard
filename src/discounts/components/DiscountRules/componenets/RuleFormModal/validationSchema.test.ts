import {
  AllocationStrategyEnum,
  type ChannelFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { testIntlInstance } from "@test/intl";

import { getValidationSchema } from "./validationSchema";

const buildRule = (overrides: Record<string, unknown> = {}) => ({
  name: "Rule name",
  description: null,
  channel: { label: "Default channel", value: "channel-id" },
  conditions: [],
  rewardType: null,
  rewardValueType: RewardValueTypeEnum.FIXED,
  rewardValue: 10,
  ...overrides,
});

const getRewardValueError = (rule: ReturnType<typeof buildRule>) => {
  const result = getValidationSchema(testIntlInstance).safeParse(rule);

  if (result.success) {
    return undefined;
  }

  return result.error.issues.find(issue => issue.path.includes("rewardValue"));
};

describe("getValidationSchema", () => {
  it.each([12.55, 0.5, 0.01])("accepts %p as a reward value", rewardValue => {
    // Arrange
    const rule = buildRule({ rewardValue });

    // Act
    const error = getRewardValueError(rule);

    // Assert
    expect(error).toBeUndefined();
  });

  it.each([0, -1, null])("rejects %p as a reward value", rewardValue => {
    // Arrange
    const rule = buildRule({ rewardValue });

    // Act
    const error = getRewardValueError(rule);

    // Assert
    expect(error).toBeDefined();
  });

  it("rejects a percentage reward value above 100", () => {
    // Arrange
    const rule = buildRule({
      rewardValueType: RewardValueTypeEnum.PERCENTAGE,
      rewardValue: 100.5,
    });

    // Act
    const error = getRewardValueError(rule);

    // Assert
    expect(error).toBeDefined();
  });

  it("accepts a fractional percentage reward value", () => {
    // Arrange
    const rule = buildRule({
      rewardValueType: RewardValueTypeEnum.PERCENTAGE,
      rewardValue: 12.5,
    });

    // Act
    const error = getRewardValueError(rule);

    // Assert
    expect(error).toBeUndefined();
  });
});

describe("getValidationSchema with the rule's other channels", () => {
  const channelFixture: ChannelFragment = {
    __typename: "Channel",
    id: "channel-id",
    isActive: true,
    name: "Channel",
    slug: "channel",
    currencyCode: "USD",
    defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
    },
  };
  const channels: ChannelFragment[] = [
    { ...channelFixture, id: "channel-usd", name: "Channel-USD", currencyCode: "USD" },
    { ...channelFixture, id: "channel-usd-2", name: "Channel-USD-2", currencyCode: "USD" },
  ];
  const twoChannelRule = buildRule({
    channel: { label: "Channel-USD", value: "channel-usd" },
    otherChannels: [{ id: "channel-pln", name: "Channel-PLN", currencyCode: "PLN" }],
  });

  const getRuleError = (rule: ReturnType<typeof buildRule>): string | undefined => {
    const result = getValidationSchema(testIntlInstance, { channels }).safeParse(rule);

    return result.success
      ? undefined
      : result.error.issues.find(issue => issue.path.includes("rewardValue"))?.message;
  };

  it("blocks a fixed amount when the other channels use another currency", () => {
    // Arrange
    const fixed = { ...twoChannelRule, rewardValueType: RewardValueTypeEnum.FIXED };
    const percentage = { ...twoChannelRule, rewardValueType: RewardValueTypeEnum.PERCENTAGE };

    // Act
    const fixedError = getRuleError(fixed);
    const percentageError = getRuleError(percentage);

    // Assert
    expect(fixedError).toBe(
      "A fixed amount needs one currency, but this rule also applies in Channel-PLN. Use a percentage instead.",
    );
    expect(percentageError).toBeUndefined();
  });

  it("allows a fixed amount when the other channels use the same currency", () => {
    // Arrange
    const sameCurrency = buildRule({
      channel: { label: "Channel-USD", value: "channel-usd" },
      otherChannels: [{ id: "channel-usd-2", name: "Channel-USD-2", currencyCode: "USD" }],
    });

    // Act
    const error = getRuleError(sameCurrency);

    // Assert
    expect(error).toBeUndefined();
  });
});
