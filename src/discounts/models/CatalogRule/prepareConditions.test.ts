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
          productPredicate: {
            ids: ["3", "4"],
            AND: [
              {
                name: {
                  eq: "test",
                },
              },
            ],
          },
        },
        {
          collectionPredicate: {
            ids: ["5", "6"],
          },
        },
      ],
    };

    const result = prepareCatalogueRuleConditions(cataloguePredicate, {});

    expect(result).toEqual([
      {
        name: "product",
        type: "is",
        values: [
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
      {
        name: "collection",
        type: "is",
        values: [
          { label: "5", value: "5" },
          { label: "6", value: "6" },
        ],
      },
    ]);
  });
});
