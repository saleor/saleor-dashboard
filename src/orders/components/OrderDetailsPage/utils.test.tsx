import { filteredConditionalItems } from "./utils";

describe("filteredConditionalItems", () => {
  it("should return empty [] when no items has shouldExist set to true", () => {
    const items = [
      {
        item: { id: "#1" },
        shouldExist: false,
      },
      {
        item: { id: "#2" },
        shouldExist: false,
      },
      {
        item: { id: "#3" },
        shouldExist: false,
      },
    ];

    expect(filteredConditionalItems(items)).toEqual([]);
  });

  it("should return only items that has shouldExist set to true", () => {
    const items = [
      {
        item: { id: "#1" },
        shouldExist: false,
      },
      {
        item: { id: "#2" },
        shouldExist: true,
      },
      {
        item: { id: "#3" },
        shouldExist: true,
      },
    ];

    expect(filteredConditionalItems(items)).toEqual([
      { id: "#2" },
      { id: "#3" },
    ]);
  });
});
