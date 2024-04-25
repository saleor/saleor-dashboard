import { Rule } from "@dashboard/discounts/models";

import { getCurrentConditionsValuesLabels } from "./utils";

describe("getCurrentConditionsValuesLabels", () => {
  it("should return empty object if no rules", () => {
    expect(getCurrentConditionsValuesLabels([])).toEqual({});
  });
  it("should return empty object if no conditions", () => {
    expect(getCurrentConditionsValuesLabels([{ conditions: [] }] as unknown as Rule[])).toEqual({});
  });
  it("should return empty object if no values", () => {
    expect(
      getCurrentConditionsValuesLabels([{ conditions: [{ value: [] }] }] as unknown as Rule[]),
    ).toEqual({});
  });
  it("should return object with value as key and label as value", () => {
    expect(
      getCurrentConditionsValuesLabels([
        { conditions: [{ value: [{ value: "test", label: "test2" }] }] },
        { conditions: [{ value: [{ value: "test3", label: "test4" }] }] },
      ] as unknown as Rule[]),
    ).toEqual({ test: "test2", test3: "test4" });
  });
});
