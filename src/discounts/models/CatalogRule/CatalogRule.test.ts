import {
  PromotionRuleDetailsFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { Condition } from "../Condition";
import { CatalogRule } from "./CatalogRule";

describe("CatalogRule model", () => {
  it("should transform domain object to API format", () => {
    const rule = new CatalogRule(
      "rule_1",
      "name",
      '{"text":"description"}',
      { label: "Channel 1", value: "channel_1" },
      null,
      1,
      RewardValueTypeEnum.FIXED,
      [
        new Condition("product", "is", [
          { value: "prod_1", label: "prod_1" },
          { value: "prod_2", label: "prod_2" },
        ]),
        new Condition("category", "is", [
          { value: "cat_1", label: "cat_1" },
          { value: "cat_2", label: "cat_2" },
        ]),
        new Condition("collection", "is", [
          { value: "coll_1", label: "coll_1" },
          { value: "coll_2", label: "coll_2" },
        ]),
        new Condition("variant", "is", [
          { value: "var_1", label: "var_1" },
          { value: "var_2", label: "var_2" },
        ]),
      ],
    );

    expect(rule.toAPI()).toEqual({
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
      id: "rule_1",
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

    expect(CatalogRule.fromAPI(rule, {})).toMatchObject({
      id: "rule_1",
      name: "name",
      channel: { label: "Channel 1", value: "channel_1" },
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
