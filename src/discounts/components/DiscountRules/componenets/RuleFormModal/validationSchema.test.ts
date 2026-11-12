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

  it("asks for more than 0 when the reward is 0, and for a value when it is empty", () => {
    // Arrange
    const zero = buildRule({ rewardValue: 0 });
    const empty = buildRule({ rewardValue: null });

    // Act
    const zeroError = getRewardValueError(zero);
    const emptyError = getRewardValueError(empty);

    // Assert
    expect(zeroError?.message).toBe("Enter more than 0.");
    expect(emptyError?.message).toBe("Rule reward value is required");
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

describe("getValidationSchema decimal places Saleor can store", () => {
  const channel = (id: string, currencyCode: string): ChannelFragment => ({
    __typename: "Channel",
    id,
    isActive: true,
    name: id,
    slug: id,
    currencyCode,
    defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
    },
  });
  const channels: ChannelFragment[] = [
    channel("channel-usd", "USD"),
    channel("channel-jpy", "JPY"),
  ];

  const getRuleError = (overrides: Record<string, unknown>): string | undefined => {
    const result = getValidationSchema(testIntlInstance, { channels }).safeParse(
      buildRule(overrides),
    );

    return result.success
      ? undefined
      : result.error.issues.find(issue => issue.path.includes("rewardValue"))?.message;
  };

  it.each([
    [0.0001, "Use up to 3 decimal places."],
    [12.3456, "Use up to 3 decimal places."],
    [0.001, undefined],
    [12.345, undefined],
  ])("checks a %p%% reward against the 3 decimals Saleor keeps", (rewardValue, expected) => {
    // Arrange & Act
    const error = getRuleError({ rewardValueType: RewardValueTypeEnum.PERCENTAGE, rewardValue });

    // Assert
    expect(error).toBe(expected);
  });

  it.each([
    ["channel-usd", 10.999, "Use up to 2 decimal places for USD."],
    ["channel-usd", 10.99, undefined],
    ["channel-usd", 1234567.89, undefined],
    ["channel-jpy", 100.5, "Enter a whole amount for JPY."],
    ["channel-jpy", 100, undefined],
  ])(
    "checks a fixed reward in %s of %p against its currency",
    (channelId, rewardValue, expected) => {
      // Arrange & Act
      const error = getRuleError({
        channel: { label: channelId, value: channelId },
        rewardValueType: RewardValueTypeEnum.FIXED,
        rewardValue,
      });

      // Assert
      expect(error).toBe(expected);
    },
  );
});
