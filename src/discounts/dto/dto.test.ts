import {
  PromotionRuleDetailsFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { Rule } from "../types";
import { RuleDTO } from "./dto";

describe("RuleDTO", () => {
  it("should transform domain object to API format", () => {
    const rule = {
      name: "name",
      description: '{"text":"description"}',
      channels: [{ value: "channel_1", label: "Channel 1" }],
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.FIXED,
      conditions: [
        {
          type: "product",
          condition: "is",
          values: [
            { value: "prod_1", label: "Product 1" },
            { value: "prod_2", label: "Product 2" },
          ],
        },
        {
          type: "category",
          condition: "is",
          values: [
            { value: "cat_1", label: "Category 1" },
            { value: "cat_2", label: "Category 2" },
          ],
        },
        {
          type: "collection",
          condition: "is",
          values: [
            { value: "coll_1", label: "Collection 1" },
            { value: "coll_2", label: "Collection 2" },
          ],
        },
        {
          type: "variant",
          condition: "is",
          values: [
            { value: "var_1", label: "Variant 1" },
            { value: "var_2", label: "Variant 2" },
          ],
        },
      ],
    } as Rule;

    expect(RuleDTO.toAPI(rule)).toEqual({
      cataloguePredicate: {
        OR: [
          {
            productPredicate: {
              ids: ["prod_1", "prod_2"],
            },
          },
          {
            categoryPredicate: {
              ids: ["cat_1", "cat_2"],
            },
          },
          {
            collectionPredicate: {
              ids: ["coll_1", "coll_2"],
            },
          },
          {
            variantPredicate: {
              ids: ["var_1", "var_2"],
            },
          },
        ],
      },
      channels: ["channel_1"],
      description: { text: "description" },
      name: "name",
      rewardValue: 1,
      rewardValueType: "FIXED",
    });
  });

  it("should transform API object to domain format", () => {
    const rule = {
      name: "name",
      description: { text: "description" },
      channels: [{ id: "channel_1", name: "Channel 1" }],
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.FIXED,
      cataloguePredicate: {
        OR: [
          {
            productPredicate: {
              ids: ["prod_1", "prod_2"],
            },
          },
          {
            categoryPredicate: {
              ids: ["cat_1", "cat_2"],
            },
          },
          {
            collectionPredicate: {
              ids: ["coll_1", "coll_2"],
            },
          },
          {
            variantPredicate: {
              ids: ["var_1", "var_2"],
            },
          },
        ],
      },
    } as PromotionRuleDetailsFragment;

    expect(RuleDTO.fromAPI(rule, {})).toEqual({
      channels: [{ value: "channel_1", label: "Channel 1" }],
      name: "name",
      description: '{"text":"description"}',
      rewardValue: 1,
      rewardValueType: RewardValueTypeEnum.FIXED,
      conditions: [
        {
          condition: "is",
          type: "product",
          values: [
            { value: "prod_1", label: "prod_1" },
            { value: "prod_2", label: "prod_2" },
          ],
        },
        {
          condition: "is",
          type: "category",
          values: [
            { value: "cat_1", label: "cat_1" },
            { value: "cat_2", label: "cat_2" },
          ],
        },
        {
          condition: "is",
          type: "collection",
          values: [
            { value: "coll_1", label: "coll_1" },
            { value: "coll_2", label: "coll_2" },
          ],
        },
        {
          condition: "is",
          type: "variant",
          values: [
            { value: "var_1", label: "var_1" },
            { value: "var_2", label: "var_2" },
          ],
        },
      ],
    });
  });
});
