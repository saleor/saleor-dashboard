import { getNavigationPinChangedProperties } from "./analytics";

describe("getNavigationPinChangedProperties", () => {
  it("does not include the pinned model type identifier", () => {
    // Act
    const result = getNavigationPinChangedProperties({
      action: "pin",
      result: "success",
      scope: "organization",
      target: "modeling",
    });

    // Assert
    expect(result).toEqual({
      action: "pin",
      result: "success",
      scope: "organization",
      target: "modeling",
    });
    expect(result).not.toHaveProperty("modelTypeId");
  });
});
