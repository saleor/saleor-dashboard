import { Condition } from "../Condition";
import { prepareCataloguePredicate } from "./preparePredicate";

describe("prepareCataloguePredicate", () => {
  it("should return empty object when conditions are empty", () => {
    const conditions: Condition[] = [];
    const result = prepareCataloguePredicate(conditions);

    expect(result).toEqual({});
  });
  it("should return object with filtered conditions", () => {
    const conditions = [
      {
        id: "",
        type: "is",
        value: null,
      },
      {
        id: "product",
        type: "is",
        value: [],
      },
      {
        id: "category",
        type: "is",
        value: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
        ],
      },
      {
        id: "collection",
        type: "is",
        value: [
          { label: "3", value: "3" },
          { label: "4", value: "4" },
        ],
      },
    ] as Condition[];
    const result = prepareCataloguePredicate(conditions);

    expect(result).toEqual({
      OR: [
        {
          categoryPredicate: {
            ids: ["1", "2"],
          },
        },
        {
          collectionPredicate: {
            ids: ["3", "4"],
          },
        },
      ],
    });
  });
});
