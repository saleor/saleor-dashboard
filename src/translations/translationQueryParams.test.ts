import { getRemovedActiveFields, isTranslationEditMode } from "./translationQueryParams";

describe("translationQueryParams", () => {
  describe("isTranslationEditMode", () => {
    it("returns true in bulk mode", () => {
      // Arrange // Act // Assert
      expect(isTranslationEditMode(true, undefined)).toBe(true);
    });

    it("returns true when a single field is active", () => {
      // Arrange // Act // Assert
      expect(isTranslationEditMode(false, "name")).toBe(true);
    });

    it("returns true when multiple fields are active", () => {
      // Arrange // Act // Assert
      expect(isTranslationEditMode(false, ["name", "description"])).toBe(true);
    });

    it("returns false when not in bulk and no active field", () => {
      // Arrange // Act // Assert
      expect(isTranslationEditMode(false, undefined)).toBe(false);
    });
  });

  describe("getRemovedActiveFields", () => {
    it("returns fields removed from multi-field edit mode", () => {
      // Arrange // Act // Assert
      expect(getRemovedActiveFields(["name", "description"], ["description"])).toEqual(["name"]);
    });

    it("returns the previous field when switching single-field edit targets", () => {
      // Arrange // Act // Assert
      expect(getRemovedActiveFields(["name"], ["description"])).toEqual(["name"]);
    });

    it("returns an empty list when active fields grow", () => {
      // Arrange // Act // Assert
      expect(getRemovedActiveFields(["name"], ["name", "description"])).toEqual([]);
    });
  });
});
