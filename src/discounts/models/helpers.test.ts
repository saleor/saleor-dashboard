import { type PromotionRuleDetailsFragment, RewardValueTypeEnum } from "@dashboard/graphql";

import { type CataloguePredicateAPI, type OrderPredicateAPI } from "../types";
import { createBaseRuleInputFromAPI, hasPredicateNestedConditions } from "./helpers";

describe("Rule Model - hasPredicateCreatedViaApi", () => {
  it("should return true if predicate has AND properties", () => {
    const catalogPredicate = {
      AND: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            giftCard: true,
          },
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return true if predicate has nested AND property", () => {
    const catalogPredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            ids: ["Q2F0ZWdvcnk6FA=="],
          },
          AND: [
            {
              collectionPredicate: {
                ids: ["Q2F0ZWdvcnk6OA=="],
              },
            },
            {
              productPredicate: {
                giftCard: true,
              },
            },
          ],
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return true if predicate is one and has not allow key", () => {
    const catalogPredicate = {
      productPredicate: {
        giftCard: true,
      },
    } as any;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return true if predicate has many nested conditions and one  has not allow key", () => {
    const catalogPredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            slug: "test",
          },
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return true if predicate has nested OR property", () => {
    const catalogPredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            ids: ["Q2F0ZWdvcnk6FA=="],
            OR: [
              {
                collectionPredicate: {
                  ids: ["Q2F0ZWdvcnk6OA=="],
                },
              },
              {
                productPredicate: {
                  giftCard: true,
                },
              },
            ],
          },
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return true if predicate has nested AND property", () => {
    const catalogPredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            ids: ["Q2F0ZWdvcnk6FA=="],
          },
        },
        {
          AND: {
            collectionPredicate: {
              ids: ["Q2F0ZWdvcnk6OA=="],
            },
            productPredicate: {
              ids: ["Q2F0ZWdvcnk6OA=="],
            },
          },
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(true);
  });
  it("should return false if predicate has only OR property", () => {
    const catalogPredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
        {
          productPredicate: {
            ids: ["Q2F0ZWdvcnk6FA=="],
          },
        },
        {
          collectionPredicate: {
            ids: ["Q2F0ZWdvcnk6OA=="],
          },
        },
      ],
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(false);
  });
  it("should return false if predicate has single not nested property", () => {
    const catalogPredicate = {
      collectionPredicate: {
        ids: ["Q2F0ZWdvcnk6OA=="],
      },
    } as CataloguePredicateAPI;

    expect(hasPredicateNestedConditions(catalogPredicate)).toBe(false);
  });
  it("shouldd return false when order predicate with proper nesting", () => {
    const orderPredicate = {
      discountedObjectPredicate: {
        OR: [
          {
            baseSubtotalPrice: {
              range: {
                gte: "33",
              },
            },
          },
          {
            baseTotalPrice: {
              range: {
                gte: "33",
                lte: "44",
              },
            },
          },
        ],
      },
    } as OrderPredicateAPI;

    expect(hasPredicateNestedConditions(orderPredicate)).toBe(false);
  });
});

describe("createBaseRuleInputFromAPI", () => {
  type RuleChannel = NonNullable<PromotionRuleDetailsFragment["channels"]>[number];

  const channel = (id: string, name: string, currencyCode: string): RuleChannel => ({
    __typename: "Channel",
    id,
    isActive: true,
    name,
    slug: id,
    currencyCode,
    defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
  });
  const rule: PromotionRuleDetailsFragment = {
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
    channels: [channel("channel-usd", "Channel-USD", "USD")],
  };

  it("carries the channels after the first one as the rule's other channels", () => {
    // Arrange
    const twoChannels: PromotionRuleDetailsFragment = {
      ...rule,
      channels: [
        channel("channel-usd", "Channel-USD", "USD"),
        channel("channel-pln", "Channel-PLN", "PLN"),
      ],
    };

    // Act
    const oneChannelRule = createBaseRuleInputFromAPI(rule, {});
    const twoChannelRule = createBaseRuleInputFromAPI(twoChannels, {});

    // Assert
    expect(oneChannelRule.otherChannels).toBeUndefined();
    expect(twoChannelRule.channel).toEqual({ label: "Channel-USD", value: "channel-usd" });
    expect(twoChannelRule.otherChannels).toEqual([
      { id: "channel-pln", name: "Channel-PLN", currencyCode: "PLN" },
    ]);
  });
});
