import { Constraint } from "./Constraint";

describe("ConditionalFilter / FilterElement / Constraint", () => {
  it("should get dependency for a valid slug", () => {
    const dependency = Constraint.getDependency("price");
    expect(dependency).toBe("channel");
  });

  it("should return null for an invalid slug", () => {
    const dependency = Constraint.getDependency("invalidSlug");
    expect(dependency).toBeNull();
  });

  it("should create an instance from a valid slug", () => {
    const constraint = Constraint.fromSlug("channel");
    expect(constraint).toEqual({
      dependsOn: ["price", "isVisibleInListing", "isAvailable", "isPublished"],
      disabled: ["left", "condition"],
      removable: false,
    });
  });

  it("should return null for an invalid slug", () => {
    const constraint = Constraint.fromSlug("invalidSlug");
    expect(constraint).toBeNull();
  });
});
