import { Rule } from "@dashboard/discounts/types";
import {
  PromotionDetailsFragment,
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
      ] as PromotionDetailsFragment["rules"];

      const formRules: Rule[] = [
        {
          id: "1",
          name: "rule 1",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ];
      const dirtyRulesIndexes = ["1"];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "channels": Array [],
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
      ] as PromotionDetailsFragment["rules"];

      const formRules: Rule[] = [
        {
          id: "1",
          name: "rule 1",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
        {
          name: "",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 0,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ];
      const dirtyRulesIndexes = ["0"];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toMatchInlineSnapshot(`
        Array [
          Object {
            "channels": Array [],
            "conditions": Array [],
            "description": "",
            "id": "1",
            "name": "rule 1",
            "rewardValue": 10,
            "rewardValueType": "FIXED",
          },
          Object {
            "channels": Array [],
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
      ] as PromotionDetailsFragment["rules"];

      const formRules: Rule[] = [
        {
          id: "1",
          name: "rule 1",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 10,
          rewardValueType: RewardValueTypeEnum.FIXED,
        },
        {
          id: "2",
          name: "rule 2",
          channels: [],
          conditions: [],
          description: "",
          rewardValue: 20,
          rewardValueType: RewardValueTypeEnum.PERCENTAGE,
        },
      ];
      const dirtyRulesIndexes: string[] = [];

      // Act
      const result = filterRules(promotionRules, formRules, dirtyRulesIndexes);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
