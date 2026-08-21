import { getTruncatedTextValue, resolveByAttributeId } from "./utils";

describe("resolveByAttributeId", () => {
  it("should call a lookup function with the attribute id", () => {
    // Arrange
    const getChoices = (attributeId: string) => (attributeId === "attr-1" ? [{ slug: "red" }] : []);

    // Act / Assert
    expect(resolveByAttributeId(getChoices, "attr-1")).toEqual([{ slug: "red" }]);
    expect(resolveByAttributeId(getChoices, "attr-2")).toEqual([]);
  });

  it("should return an empty list when the value is missing", () => {
    // Arrange / Act / Assert
    expect(resolveByAttributeId(undefined, "attr-1")).toEqual([]);
  });
});

describe("getTruncatedTextValue", () => {
  it("should truncate the value if it is longer than the specified length", () => {
    expect(getTruncatedTextValue("Hello, world!", 5)).toBe("Hello...");
  });

  it("should return the value if it is shorter than the specified length", () => {
    expect(getTruncatedTextValue("Hello", 10)).toBe("Hello");
  });

  it("should return the value if it is exactly the specified length", () => {
    expect(getTruncatedTextValue("Hello", 5)).toBe("Hello");
  });

  it("should return the value if it is empty", () => {
    expect(getTruncatedTextValue("", 5)).toBe("");
  });

  it("should return the value if it is undefined", () => {
    expect(getTruncatedTextValue(undefined, 5)).toBe(undefined);
  });
});
