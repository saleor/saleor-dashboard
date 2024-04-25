import { OrderPredicateAPI } from "@dashboard/discounts/types";

import { prepareOrderConditions } from "./prepareConditions";

describe("prepareOrderConditions", () => {
  it("should return empty array when orderPredicate is empty", () => {
    const orderPredicate = {} as OrderPredicateAPI;
    const result = prepareOrderConditions(orderPredicate);

    expect(result).toEqual([]);
  });
  it("should return array of conditions when orderPredicate is not empty", () => {
    const orderPredicate = {
      discountedObjectPredicate: {
        AND: [
          {
            baseSubtotalPrice: {
              range: {
                gte: 100,
              },
            },
          },
          {
            OR: [
              {
                baseTotalPrice: {
                  eq: 1,
                },
              },
              {
                baseTotalPrice: {
                  range: {
                    gte: 50,
                    lte: 100,
                  },
                },
              },
            ],
          },
        ],
      },
    } as OrderPredicateAPI;
    const result = prepareOrderConditions(orderPredicate.discountedObjectPredicate);

    expect(result).toEqual([
      {
        id: "baseSubtotalPrice",
        type: "greater",
        value: 100,
      },
      {
        id: "baseTotalPrice",
        type: "is",
        value: 1,
      },
      {
        id: "baseTotalPrice",
        type: "between",
        value: [50, 100],
      },
    ]);
  });
});
