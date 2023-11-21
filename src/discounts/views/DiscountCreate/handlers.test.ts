import { Rule } from "@dashboard/discounts/types";
import { RewardValueTypeEnum } from "@dashboard/graphql";

import { toAPIRule } from "./handlers";

describe("DiscountCreate/handlers", () => {
  describe("toAPIRule", () => {
    it("should return PromotionRuleInput", () => {
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
            type: "categorie",
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

      expect(toAPIRule(rule)).toEqual({
        cataloguePredicate: {
          OR: [
            {
              productPredicate: {
                ids: ["prod_1", "prod_2"],
              },
            },
            {
              categoriePredicate: {
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
  });
});
