import { CataloguePredicateAPI } from "../types";
import { Condition } from "./Condition";

describe("Condition model", () => {
  it("should transform API object to domain format", () => {
    const condition = {
      productPredicate: {
        ids: ["prod_1", "prod_2"],
      },
    } as CataloguePredicateAPI;

    expect(Condition.fromAPI(condition, {})).toMatchObject({
      condition: "is",
      type: "product",
      values: [
        { value: "prod_1", label: "prod_1" },
        { value: "prod_2", label: "prod_2" },
      ],
    });
  });

  it("should transform domain object to API object", () => {
    const condition = new Condition("product", "is", [
      { value: "prod_1", label: "prod_1" },
      { value: "prod_2", label: "prod_2" },
    ]);

    expect(condition.toAPI()).toMatchObject({
      productPredicate: {
        ids: ["prod_1", "prod_2"],
      },
    });
  });

  it("should return undefined when transforming domian object to API and values array is empty", () => {
    const condition = new Condition("product", "is", []);

    expect(condition.toAPI()).toBeUndefined();
  });
});
