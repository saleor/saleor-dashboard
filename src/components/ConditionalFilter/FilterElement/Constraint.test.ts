import { Constraint } from "./Constraint";

describe("ConditionalFilter / FilterElement / Constraint", () => {
  it("should get dependency for a valid slug", () => {
    // Arrange & Act
    const dependency = Constraint.getDependency("price");
    // Assert
    expect(dependency).toBe("channel");
  });
  it("should return null for an invalid slug", () => {
    // Arrange & Act
    const dependency = Constraint.getDependency("invalidSlug");
    // Assert
    expect(dependency).toBeNull();
  });
  it("should create an instance from a valid slug", () => {
    // Arrange & Act
    const constraint = Constraint.fromSlug("channel");
    // Assert
    expect(constraint).toEqual({
      dependsOn: ["price", "isVisibleInListing", "isAvailable", "isPublished"],
      disabled: ["left", "condition"],
      removable: false,
    });
  });
  it("should return null for an invalid slug", () => {
    // Arrange & Act
    const constraint = Constraint.fromSlug("invalidSlug");
    // Assert
    expect(constraint).toBeNull();
  });
});
