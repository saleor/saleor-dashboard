import {
  PromotionRuleDetailsFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { Condition } from "../Condition";
import { OrderRule } from "./OrderRule";

describe("OrderRule model", () => {
  it("should transform domain object to API format", () => {
    const rule = new OrderRule(
      "rule_1",
      "name",
      '{"text":"description"}',
      { label: "Channel 1", value: "channel_1" },
      null,
      1,
      RewardValueTypeEnum.FIXED,
      [
        new Condition("baseSubtotalPrice", "is", "20"),
        new Condition("baseTotalPrice", "greater", "10"),
      ],
    );

    expect(rule.toAPI()).toEqual({
      orderPredicate: {
        discountedObjectPredicate: {
          OR: [
            {
              baseSubtotalPrice: {
                eq: "20",
              },
            },
            {
              baseTotalPrice: {
                range: {
                  gte: "10",
                },
              },
            },
          ],
        },
      },
      rewardType: "SUBTOTAL_DISCOUNT",
      channels: ["channel_1"],
      description: { text: "description" },
      name: "name",
      rewardValue: 1,
      rewardValueType: "FIXED",
    });
  });

  it("should transform API object to domain format", () => {
    const rule = {
      id: "rule_1",
      name: "name",
      description: { text: "description" },
      channels: [{ id: "channel_1", name: "Channel 1" }],
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.FIXED,
      orderPredicate: {
        discountedObjectPredicate: {
          baseSubtotalPrice: {
            range: {
              gte: "10",
              lte: "30",
            },
          },
        },
      },
    } as PromotionRuleDetailsFragment;

    expect(OrderRule.fromAPI(rule)).toMatchObject({
      id: "rule_1",
      name: "name",
      channel: { label: "Channel 1", value: "channel_1" },
      description: '{"text":"description"}',
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.FIXED,
      conditions: [
        {
          type: "between",
          name: "baseSubtotalPrice",
          values: ["10", "30"],
        },
      ],
    });
  });
});
