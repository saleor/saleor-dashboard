import { CataloguePredicateAPI } from "../types";
import { hasPredicateNestedConditions } from "./helpers";

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
});
