import { Rule } from "@dashboard/discounts/models";

import { getCurrentConditionsValuesLabels } from "./utils";

describe("getCurrentConditionsValuesLabels", () => {
  it("should return empty object if no rules", () => {
    expect(getCurrentConditionsValuesLabels([])).toEqual({});
  });

  it("should return empty object if no conditions", () => {
    expect(
      getCurrentConditionsValuesLabels([
        { conditions: [] },
      ] as unknown as Rule[]),
    ).toEqual({});
  });

  it("should return empty object if no values", () => {
    expect(
      getCurrentConditionsValuesLabels([
        { conditions: [{ values: [] }] },
      ] as unknown as Rule[]),
    ).toEqual({});
  });

  it("should return object with value as key and label as value", () => {
    expect(
      getCurrentConditionsValuesLabels([
        { conditions: [{ values: [{ value: "test", label: "test2" }] }] },
        { conditions: [{ values: [{ value: "test3", label: "test4" }] }] },
      ] as unknown as Rule[]),
    ).toEqual({ test: "test2", test3: "test4" });
  });
});
