import { ApolloError } from "@apollo/client";
import { type Rule } from "@dashboard/discounts/models/Rule";
import { type MutationOutcome } from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  type PromotionDetailsFragment,
  type PromotionRuleUpdateMutation,
  PromotionTypeEnum,
  PromotionUpdateErrorCode,
  type PromotionUpdateMutation,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { type DiscoutFormData } from "../../types";
import {
  createRuleUpdateHandler,
  createUpdateHandler,
  shouldClearPromotionEndDateFirst,
} from "./handlers";

describe("shouldClearPromotionEndDateFirst", () => {
  it("returns true when clearing end and moving start past the previous end", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("returns false when end date remains enabled", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: true,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("returns false when there is no current end date to clear", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-08-28T14:40:00.000Z",
        currentEndDate: null,
      }),
    ).toBe(false);
  });

  it("returns false when the new start is still before the previous end", () => {
    // Arrange // Act // Assert
    expect(
      shouldClearPromotionEndDateFirst({
        hasEndDate: false,
        nextStartDate: "2026-07-15T14:40:00.000Z",
        currentEndDate: "2026-08-01T00:00:00.000Z",
      }),
    ).toBe(false);
  });
});

describe("createUpdateHandler", () => {
  const promotion = {
    __typename: "Promotion" as const,
    id: "promo-1",
    name: "Summer",
    type: null,
    description: null,
    startDate: "2026-07-01T00:00:00.000Z",
    endDate: "2026-08-01T00:00:00.000Z",
    rules: [],
  };

  const formData: DiscoutFormData = {
    name: "Summer",
    type: PromotionTypeEnum.CATALOGUE,
    description: "",
    rules: [],
    dates: {
      startDate: "2026-08-28",
      startTime: "14:40",
      endDate: "2026-08-01",
      endTime: "00:00",
      hasEndDate: false,
    },
  };

  const savedUpdate: MutationOutcome<PromotionUpdateMutation> = {
    data: {
      __typename: "Mutation",
      promotionUpdate: { __typename: "PromotionUpdate", errors: [], promotion: null },
    },
  };
  const rejectedUpdate: MutationOutcome<PromotionUpdateMutation> = {
    data: {
      __typename: "Mutation",
      promotionUpdate: {
        __typename: "PromotionUpdate",
        errors: [
          {
            __typename: "PromotionUpdateError",
            field: "name",
            code: PromotionUpdateErrorCode.INVALID,
            message: "Ensure this value has at most 255 characters (it has 286).",
          },
        ],
        promotion: null,
      },
    },
  };
  const failedRequest: MutationOutcome<PromotionUpdateMutation> = {
    data: null,
    errors: new ApolloError({ errorMessage: "Failed to fetch" }),
  };

  it("clears end date before updating start when they would conflict", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue(savedUpdate);
    const restoreEndDate = jest.fn();
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    await handler(formData);

    // Assert
    expect(update).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenNthCalledWith(
      1,
      {
        id: "promo-1",
        input: { endDate: null },
      },
      { silent: true },
    );
    expect(update.mock.calls[1][0].input.endDate).toBeNull();
    expect(update.mock.calls[1][0].input.startDate).toBeTruthy();
    expect(update.mock.calls[1][1]).toBeUndefined();
    expect(restoreEndDate).not.toHaveBeenCalled();
  });

  it("skips the clear step when end date stays enabled", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue(savedUpdate);
    const handler = createUpdateHandler({ promotion, update, restoreEndDate: jest.fn() });

    // Act
    await handler({
      ...formData,
      dates: {
        ...formData.dates,
        hasEndDate: true,
        endDate: "2026-09-01",
        endTime: "23:59",
      },
    });

    // Assert
    expect(update).toHaveBeenCalledTimes(1);
    expect(update.mock.calls[0][0].input.endDate).toBeTruthy();
  });

  it("puts the end date back when the update after clearing it is rejected", async () => {
    // Arrange
    const update = jest
      .fn()
      .mockResolvedValueOnce(savedUpdate)
      .mockResolvedValueOnce(rejectedUpdate);
    const restoreEndDate = jest.fn().mockResolvedValue(true);
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    const result = await handler(formData);

    // Assert
    expect(restoreEndDate).toHaveBeenCalledWith("2026-08-01T00:00:00.000Z");
    expect(result?.errors).toEqual([
      {
        __typename: "PromotionUpdateError",
        field: "name",
        code: PromotionUpdateErrorCode.INVALID,
        message: "Ensure this value has at most 255 characters (it has 286).",
      },
    ]);
  });

  it("puts the end date back when the update after clearing it fails as a request", async () => {
    // Arrange
    const update = jest
      .fn()
      .mockResolvedValueOnce(savedUpdate)
      .mockResolvedValueOnce(failedRequest);
    const restoreEndDate = jest.fn().mockResolvedValue(true);
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    const result = await handler(formData);

    // Assert
    expect(restoreEndDate).toHaveBeenCalledWith("2026-08-01T00:00:00.000Z");
    expect(result?.errors).toHaveLength(1);
  });

  it("does not send the update when clearing the end date fails", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValueOnce(failedRequest);
    const restoreEndDate = jest.fn();
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    const result = await handler(formData);

    // Assert
    expect(update).toHaveBeenCalledTimes(1);
    expect(restoreEndDate).not.toHaveBeenCalled();
    expect(result?.errors).toHaveLength(1);
  });

  it("leaves the end date alone when an update that did not clear it is rejected", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue(rejectedUpdate);
    const restoreEndDate = jest.fn();
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    await handler({
      ...formData,
      dates: { ...formData.dates, hasEndDate: true, endDate: "2026-09-01", endTime: "23:59" },
    });

    // Assert
    expect(update).toHaveBeenCalledTimes(1);
    expect(restoreEndDate).not.toHaveBeenCalled();
  });

  it("puts the end date back when the update after clearing it throws", async () => {
    // Arrange
    const update = jest
      .fn()
      .mockResolvedValueOnce(savedUpdate)
      .mockRejectedValueOnce(new Error("Link failed"));
    const restoreEndDate = jest.fn().mockResolvedValue(true);
    const handler = createUpdateHandler({ promotion, update, restoreEndDate });

    // Act
    const result = handler(formData);

    // Assert
    await expect(result).rejects.toThrow("Link failed");
    expect(restoreEndDate).toHaveBeenCalledWith("2026-08-01T00:00:00.000Z");
  });

  it("sends nothing when the update cannot be built", async () => {
    // Arrange
    const update = jest.fn().mockResolvedValue(savedUpdate);
    const handler = createUpdateHandler({ promotion, update, restoreEndDate: jest.fn() });

    // Act
    const result = handler({ ...formData, description: "{not json" });

    // Assert
    await expect(result).rejects.toThrow();
    expect(update).not.toHaveBeenCalled();
  });
});

describe("createRuleUpdateHandler", () => {
  type RuleChannel = NonNullable<
    NonNullable<PromotionDetailsFragment["rules"]>[number]["channels"]
  >[number];

  const usd: RuleChannel = {
    __typename: "Channel",
    id: "channel-usd",
    isActive: true,
    name: "Channel-USD",
    slug: "default-channel",
    currencyCode: "USD",
    defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
  };
  const pln: RuleChannel = {
    ...usd,
    id: "channel-pln",
    name: "Channel-PLN",
    slug: "channel-pln",
    currencyCode: "PLN",
    defaultCountry: { __typename: "CountryDisplay", code: "PL", country: "Poland" },
  };
  const promotion: PromotionDetailsFragment = {
    __typename: "Promotion",
    id: "promo-1",
    name: "Summer",
    type: PromotionTypeEnum.CATALOGUE,
    description: null,
    startDate: "2026-07-01T00:00:00.000Z",
    endDate: null,
    rules: [
      {
        __typename: "PromotionRule",
        id: "rule-1",
        name: "Two channels",
        description: null,
        giftIds: [],
        rewardType: null,
        rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        rewardValue: 5,
        cataloguePredicate: {},
        orderPredicate: null,
        // Made through the API; the rule form shows only the first channel.
        channels: [usd, pln],
      },
    ],
  };
  // What the rule form submits for that rule: the first channel, and the others it carries.
  const formRule: Rule = {
    id: "rule-1",
    name: "Two channels",
    description: null,
    channel: { label: usd.name, value: usd.id },
    rewardType: null,
    rewardValue: 5,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
    rewardGifts: [],
    conditions: [],
    otherChannels: [{ id: pln.id, name: pln.name, currencyCode: pln.currencyCode }],
  };
  // What a mutation hook with `onError` resolves with when the whole request fails.
  const offline = new ApolloError({ networkError: new TypeError("Failed to fetch") });
  const savedRule: { data: PromotionRuleUpdateMutation } = {
    data: {
      __typename: "Mutation",
      promotionRuleUpdate: { __typename: "PromotionRuleUpdate", errors: [], promotionRule: null },
    },
  };

  it.each([
    ["counts a request that failed as a whole as a failure", { errors: offline }, 1],
    ["counts a saved rule as saved", savedRule, 0],
  ])("%s", async (_case, outcome, errorCount) => {
    // Arrange
    const updateRule = jest.fn().mockResolvedValue(outcome);
    const handler = createRuleUpdateHandler(promotion, updateRule);

    // Act
    const errors = await handler(formRule);

    // Assert
    expect(errors).toHaveLength(errorCount);
  });

  it("keeps the channels the form does not show when the rule is renamed", async () => {
    // Arrange
    const updateRule = jest.fn().mockResolvedValue(savedRule);
    const handler = createRuleUpdateHandler(promotion, updateRule);

    // Act
    await handler({ ...formRule, name: "Two channels renamed" });

    // Assert
    expect(updateRule.mock.calls[0][0].input).toMatchObject({
      name: "Two channels renamed",
      addChannels: [],
      removeChannels: [],
    });
  });

  it("moves a rule on one channel to the channel the merchant picks", async () => {
    // Arrange
    const singleChannelPromotion: PromotionDetailsFragment = {
      ...promotion,
      rules: (promotion.rules ?? []).map(rule => ({ ...rule, channels: [usd] })),
    };
    const updateRule = jest.fn().mockResolvedValue(savedRule);
    const handler = createRuleUpdateHandler(singleChannelPromotion, updateRule);

    // Act
    await handler({
      ...formRule,
      channel: { label: pln.name, value: pln.id },
      otherChannels: undefined,
    });

    // Assert
    expect(updateRule.mock.calls[0][0].input).toMatchObject({
      addChannels: ["channel-pln"],
      removeChannels: ["channel-usd"],
    });
  });
});
