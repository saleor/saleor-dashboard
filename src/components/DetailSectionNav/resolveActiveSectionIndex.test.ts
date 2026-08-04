import { resolveActiveSectionIndex } from "./resolveActiveSectionIndex";

describe("resolveActiveSectionIndex", () => {
  it("returns -1 when there are no sections", () => {
    // Arrange
    const sectionTops: number[] = [];

    // Act
    const result = resolveActiveSectionIndex({
      sectionTops,
      markerY: 100,
      nearBottom: false,
    });

    // Assert
    expect(result).toBe(-1);
  });

  it("keeps the first section while its top is still below the marker", () => {
    // Arrange // Act
    const result = resolveActiveSectionIndex({
      sectionTops: [120, 400, 800],
      markerY: 100,
      nearBottom: false,
    });

    // Assert
    expect(result).toBe(0);
  });

  it("advances to the last section whose top has crossed the marker", () => {
    // Arrange // Act
    const result = resolveActiveSectionIndex({
      sectionTops: [40, 90, 400],
      markerY: 100,
      nearBottom: false,
    });

    // Assert
    expect(result).toBe(1);
  });

  it("selects the last section when scrolled to the bottom", () => {
    // Arrange // Act
    const result = resolveActiveSectionIndex({
      sectionTops: [40, 90, 400],
      markerY: 100,
      nearBottom: true,
    });

    // Assert
    expect(result).toBe(2);
  });
});
