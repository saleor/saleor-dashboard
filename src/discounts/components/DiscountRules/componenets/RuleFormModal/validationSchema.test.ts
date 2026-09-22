import { RewardValueTypeEnum } from "@dashboard/graphql";
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
