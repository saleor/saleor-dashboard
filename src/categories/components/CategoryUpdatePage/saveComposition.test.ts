import {
  buildCategorySaveComposition,
  EMPTY_CATEGORY_SAVE_COMPOSITION,
  hasCategorySaveComposition,
} from "./saveComposition";

describe("buildCategorySaveComposition", () => {
  it("returns empty composition when nothing changed", () => {
    // Arrange / Act
    const composition = buildCategorySaveComposition([], false);

    // Assert
    expect(composition).toEqual(EMPTY_CATEGORY_SAVE_COMPOSITION);
    expect(hasCategorySaveComposition(composition)).toBe(false);
  });

  it("marks general when a form field or description is dirty", () => {
    // Arrange / Act / Assert
    expect(hasCategorySaveComposition(buildCategorySaveComposition(["name"], false))).toBe(true);
    expect(hasCategorySaveComposition(buildCategorySaveComposition([], true))).toBe(true);
  });
});
