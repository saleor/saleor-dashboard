import { Condition } from "../Condition";
import { prepareOrderPredicate } from "./preparePredicate";

describe("prepareOrderPredicate", () => {
  it("should return empty object when conditions are empty", () => {
    const conditions: Condition[] = [];

    const result = prepareOrderPredicate(conditions);

    expect(result).toEqual({
      discountedObjectPredicate: {},
    });
  });

  it("should return object with filtered conditions", () => {
    const conditions = [
      {
        id: "",
        type: "is",
        value: null,
      },
      {
        id: "baseTotalPrice",
        type: "is",
        value: "1",
      },
      {
        id: "",
        type: "is",
        value: null,
      },
      {
        id: "baseSubtotalPrice",
        type: "range",
        value: {
          gte: "50",
          lte: "100",
        },
      },
    ] as Condition[];

    const result = prepareOrderPredicate(conditions);

    expect(result).toEqual({
      discountedObjectPredicate: {
        OR: [
          {
            baseTotalPrice: {
              eq: "1",
            },
          },
          {
            baseSubtotalPrice: {
              eq: {
                gte: "50",
                lte: "100",
              },
            },
          },
        ],
      },
    });
  });
});
