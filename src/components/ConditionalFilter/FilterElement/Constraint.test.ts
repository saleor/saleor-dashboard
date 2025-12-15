import { Constraint, GLOBAL } from "./Constraint";

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
      isGlobal: false,
    });
  });

  it("should return null when creating from an invalid slug", () => {
    // Arrange
    // Act
    const constraint = Constraint.fromSlug("invalidSlug");

    // Assert
    expect(constraint).toBeNull();
  });

  it("should return false for empty dependsOn (subject to cleanup)", () => {
    // Arrange
    // If `dependsOn` is empty and not GLOBAL, the constraint can be cleaned up.
    const constraint = new Constraint([]);

    // Act
    const exists = constraint.existIn([]);

    // Assert
    expect(exists).toBe(false);
    expect(constraint.isGlobal).toBe(false);
  });

  it("should always return true for GLOBAL constraint (exempt from cleanup)", () => {
    // Arrange
    // GLOBAL constraints are never cleaned up, regardless of container state.
    const constraint = new Constraint(GLOBAL, ["left", "right", "condition"], false);

    // Act
    const exists = constraint.existIn([]);

    // Assert
    expect(exists).toBe(true);
    expect(constraint.isGlobal).toBe(true);
    expect(constraint.dependsOn).toEqual([]);
  });

  it("should set isGlobal to true when created with GLOBAL", () => {
    // Arrange & Act
    const constraint = new Constraint(GLOBAL);

    // Assert
    expect(constraint.isGlobal).toBe(true);
    expect(constraint.dependsOn).toEqual([]);
  });

  it("should set isGlobal to false when created with array", () => {
    // Arrange & Act
    const constraint = new Constraint(["price", "category"]);

    // Assert
    expect(constraint.isGlobal).toBe(false);
    expect(constraint.dependsOn).toEqual(["price", "category"]);
  });
});
