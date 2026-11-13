import { catalogRules } from "@dashboard/discounts/components/DiscountRules/mocksData";
import { type PromotionRuleCreateErrorFragment } from "@dashboard/graphql";
import { type CommonError } from "@dashboard/utils/errors/common";
import { act, renderHook } from "@testing-library/react";

import { useRulesHandlers } from "./useRulesHandlers";

// What the API answers for an amount the channel currency can't store.
const precisionError: CommonError<PromotionRuleCreateErrorFragment> = {
  field: "rewardValue",
  message: "Invalid amount precision.",
};

// Stable across renders: the hook copies the condition labels whenever this map changes.
const noLabels: Record<string, string> = {};

const renderHandlers = (onRuleCreateSubmit: jest.Mock) =>
  renderHook(() =>
    useRulesHandlers({
      data: null,
      ruleConditionsOptionsDetailsMap: noLabels,
      giftsOptionsDetailsMap: noLabels,
      onRuleUpdateSubmit: jest.fn(() => Promise.resolve([])),
      onRuleCreateSubmit,
      onRuleDeleteSubmit: jest.fn(() => Promise.resolve(true)),
    }),
  );

describe("DiscountDetailsForm useRulesHandlers", () => {
  it("reports a rule the API refused, and keeps its errors to show in the dialog", async () => {
    // Arrange
    const { result } = renderHandlers(jest.fn(() => Promise.resolve([precisionError])));

    // Act
    let saved: boolean | undefined;

    await act(async () => {
      saved = await result.current.onRuleSubmit(catalogRules[0], null);
    });

    // Assert
    expect(saved).toBe(false);
    expect(result.current.rulesErrors).toEqual([precisionError]);
  });

  it("reports a saved rule, and drops errors from an earlier attempt", async () => {
    // Arrange
    const onRuleCreateSubmit = jest
      .fn()
      .mockResolvedValueOnce([precisionError])
      .mockResolvedValueOnce([]);
    const { result } = renderHandlers(onRuleCreateSubmit);

    await act(async () => {
      await result.current.onRuleSubmit(catalogRules[0], null);
    });

    // Act
    let saved: boolean | undefined;

    await act(async () => {
      saved = await result.current.onRuleSubmit(catalogRules[0], null);
    });

    // Assert
    expect(saved).toBe(true);
    expect(result.current.rulesErrors).toEqual([]);
  });
});
