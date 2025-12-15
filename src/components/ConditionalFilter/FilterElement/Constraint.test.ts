import { Constraint } from "./Constraint";

describe("ConditionalFilter / FilterElement / Constraint", () => {
  it("should get dependency for a valid slug", () => {
    // Arrange
    // Act
    const dependency = Constraint.getDependency("price");

    // Assert
    expect(dependency).toBe("channel");
  });

  it("should return null for an invalid slug", () => {
    // Arrange
    // Act
    const dependency = Constraint.getDependency("invalidSlug");

    // Assert
    expect(dependency).toBeNull();
  });

  it("should create an instance from a valid slug", () => {
    // Arrange
    // Act
    const constraint = Constraint.fromSlug("channel");

    // Assert
    expect(constraint).toEqual({
      dependsOn: ["price", "isVisibleInListing", "isAvailable", "isPublished", "published"],
      disabled: ["left", "condition"],
      removable: false,
    });
  });

  it("should return null when creating from an invalid slug", () => {
    // Arrange
    // Act
    const constraint = Constraint.fromSlug("invalidSlug");

    // Assert
    expect(constraint).toBeNull();
  });

  it("should treat empty dependsOn as always existing (so it won't be auto-cleared)", () => {
    // Arrange
    // If `dependsOn` is empty, this constraint isn't tied to any filter row.
    // We treat it as always present so it won't be removed during cleanup.
    const constraint = new Constraint([]);

    // Act
    const exists = constraint.existIn([]);

    // Assert
    expect(exists).toBe(true);
  });
});
