import { stabilizeReferenceIds } from "./stabilizeReferenceIds";

describe("stabilizeReferenceIds", () => {
  it("returns the same ids after a reorder", () => {
    // Arrange
    const original = ["c", "a", "b"];
    const moved = ["a", "c", "b"];

    // Act
    const first = stabilizeReferenceIds(original, 100);
    const second = stabilizeReferenceIds(moved, 100);

    // Assert
    expect(first).toEqual(["a", "b", "c"]);
    expect(second).toEqual(first);
  });

  it("caps the page in display order before sorting", () => {
    // Arrange // Act // Assert
    expect(stabilizeReferenceIds(["c", "b", "a"], 2)).toEqual(["b", "c"]);
    expect(stabilizeReferenceIds(["b", "a", "b"], 2)).toEqual(["a", "b"]);
  });
});
