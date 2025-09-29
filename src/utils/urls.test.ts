import { getMultipleUrlValues } from "@dashboard/utils/urls";

describe("getMultipleUrlValues", () => {
  it("Returns empty array if no value in url", () => {
    const params = new URLSearchParams();

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toBe([]);
  });
  it("Returns single item array if 1 value in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toBe(["value1"]);
  });
  it("Returns 2 item array if 2 values in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["fieldName", "value2"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toBe(["value1", "value2"]);
  });
});
