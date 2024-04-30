import { CataloguePredicateAPI } from "@dashboard/discounts/types";

import { prepareCatalogueRuleConditions } from "./prepareConditions";

describe("prepareCataloguePredicate", () => {
  it("should return empty array when cataloguePredicate is empty", () => {
    const cataloguePredicate = {};
    const result = prepareCatalogueRuleConditions(cataloguePredicate, {});

    expect(result).toEqual([]);
  });
  it("should return array of conditions when cataloguePredicate is not empty", () => {
    const cataloguePredicate = {
      OR: [
        {
          collectionPredicate: {
            ids: ["1"],
          },
        },
        {
          productPredicate: {
            ids: ["2"],
          },
          AND: [
            {
              collectionPredicate: {
                ids: ["3"],
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
    const result = prepareCatalogueRuleConditions(cataloguePredicate, {});

    expect(result).toEqual([
      {
        id: "collection",
        type: "is",
        value: [{ label: "1", value: "1" }],
      },
      {
        id: "product",
        type: "is",
        value: [{ label: "2", value: "2" }],
      },
      {
        id: "collection",
        type: "is",
        value: [{ label: "3", value: "3" }],
      },
      {
        id: "product",
        type: "is",
        value: [],
      },
    ]);
  });
});
