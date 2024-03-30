import { Rule } from "@dashboard/discounts/models";
import { PromotionTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useRulesHandlers } from "./useRulesHandlers";

const rule = {
  name: "Rule 1",
  description: "",
  channel: { label: "Channel 1", value: "channel-1" },
  rewardValue: 10,
  rewardValueType: RewardValueTypeEnum.FIXED,
  conditions: [],
} as unknown as Rule;

describe("DiscountCreateForm useRulesHandlers", () => {
  it("should allow to add new rule ", () => {
    // Arrange
    const { result } = renderHook(() =>
      useRulesHandlers(PromotionTypeEnum.CATALOGUE),
    );

    // Act
    act(() => {
      result.current.onRuleSubmit({ ...rule } as Rule, null);
    });

    // Assert
    expect(result.current.rules).toEqual([rule]);
  });

  it("should allow to edit rule at index", () => {
    // Arrange
    const { result } = renderHook(() =>
      useRulesHandlers(PromotionTypeEnum.CATALOGUE),
    );

    const rule = {
      name: "Rule 1",
      description: "",
      channel: { label: "Channel 1", value: "channel-1" },
      rewardValue: 10,
      rewardValueType: RewardValueTypeEnum.FIXED,
      conditions: [],
    } as unknown as Rule;

    // Act
    act(() => {
      result.current.onRuleSubmit(rule, null);
    });

    act(() => {
      result.current.onRuleSubmit({ ...rule, name: "Rule 2" } as Rule, 0);
    });

    // Assert
    expect(result.current.rules).toEqual([{ ...rule, name: "Rule 2" }]);
  });

  it("should allow to delete rule at index", () => {
    // Arrange
    const { result } = renderHook(() =>
      useRulesHandlers(PromotionTypeEnum.CATALOGUE),
    );

    const rule = {
      name: "Rule 1",
      description: "",
      channel: { label: "Channel 1", value: "channel-1" },
      rewardValue: 10,
      rewardValueType: RewardValueTypeEnum.FIXED,
      conditions: [],
    } as unknown as Rule;

    // Act
    act(() => {
      result.current.onRuleSubmit(rule, null);
    });

    act(() => {
      result.current.onDeleteRule(0);
    });

    // Assert
    expect(result.current.rules).toEqual([]);
  });
});
