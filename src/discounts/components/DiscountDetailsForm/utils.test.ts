import { Rule } from "@dashboard/discounts/models";
import {
  PromotionRuleDetailsFragment,
  RewardValueTypeEnum,
} from "@dashboard/graphql";

import { filterRules } from "./utils";

describe("DiscountDetailsPage, utils", () => {
  describe("filterRules", () => {
    it("should return only dirty rules", () => {
      // Arrange
      const promotionRules = [
        {
          id: "1",
          name: "rule 1",
        },
        {
          id: "2",
          name: "rule 2",
        },
      ] as PromotionRuleDetailsFragment[];

      const formRules = [
        {
          id: "1",
          name: "rule 1",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ] as unknown as Rule[];
      const dirtyRulesIndexes = ["1"];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "channel": null,
            "conditions": Array [],
            "description": "",
            "id": "2",
            "name": "rule 2",
            "rewardValue": 20,
            "rewardValueType": "PERCENTAGE",
          },
        ]
      `);
    });

    it("should return dirty and new added rules", () => {
      // Arrange
      const promotionRules = [
        {
          id: "1",
          name: "rule 1",
        },
        {
          id: "2",
          name: "rule 2",
        },
      ] as PromotionRuleDetailsFragment[];

      const formRules = [
        {
          id: "1",
          name: "rule 1",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
        {
          name: "",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 0,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ] as unknown as Rule[];
      const dirtyRulesIndexes = ["0"];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "channel": null,
            "conditions": Array [],
            "description": "",
            "id": "1",
            "name": "rule 1",
            "rewardValue": 10,
            "rewardValueType": "FIXED",
          },
          Object {
            "channel": null,
            "conditions": Array [],
            "description": "",
            "name": "",
            "rewardValue": 0,
            "rewardValueType": "PERCENTAGE",
          },
        ]
      `);
    });

    it("should return empty array when no new added or dirty rules", () => {
      // Arrange
      const promotionRules = [
        {
          id: "1",
          name: "rule 1",
        },
        {
          id: "2",
          name: "rule 2",
        },
      ] as PromotionRuleDetailsFragment[];

      const formRules = [
        {
          id: "1",
          name: "rule 1",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channel: null,
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ] as unknown as Rule[];
      const dirtyRulesIndexes: string[] = [];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
