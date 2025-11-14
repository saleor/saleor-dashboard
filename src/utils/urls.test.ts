import { getMultipleUrlValues } from "@dashboard/utils/urls";

describe("getMultipleUrlValues", () => {
  it("Returns empty array if no value in url", () => {
    const params = new URLSearchParams();

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual([]);
  });
  it("Returns single item array if 1 value in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual(["value1"]);
  });
  it("Returns 2 item array if 2 values in url", () => {
    const params = new URLSearchParams([
      ["fieldName", "value1"],
      ["fieldName", "value2"],
      ["otherField", "otherValue"],
    ]);

    expect(getMultipleUrlValues(params.toString(), "fieldName")).toEqual(["value1", "value2"]);
  });

  it("Works with real URL containing multiple values", () => {
    const url = new URL(
      "http://localhost:9000/translations/PL/products/UHJvZHVjdDoxNTc%3D?activeField=name&activeField=description&otherParam=value",
    );

    expect(getMultipleUrlValues(url.search, "activeField")).toEqual(["name", "description"]);
  });
});
