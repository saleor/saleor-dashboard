import { getActiveTabIndexAfterTabDelete, getNextUniqueTabName } from "./utils";

describe("ProductList utils", () => {
  describe("getNextUniqueTabName", () => {
    it("should return unique name", () => {
      // Arrange
      const name = "test";
      const availableNames = ["test", "test 1", "test 2"];
      // Act
      const result = getNextUniqueTabName(name, availableNames);

      // Assert
      expect(result).toEqual("test 3");
    });
  });
  describe("getActiveTabIndexAfterDelete", () => {
    it("should return active tab index descread by one when delete index before current tab index", () => {
      // Arrange
      const currentTab = 5;
      const tabIndexToDelete = 1;
      // Act
      const result = getActiveTabIndexAfterTabDelete(currentTab, tabIndexToDelete);

      // Assert
      expect(result).toEqual("4");
    });
    it("should return active tab same active tab index when delete tab index higher than current tab", () => {
      // Arrange
      const currentTab = 5;
      const tabIndexToDelete = 7;
      // Act
      const result = getActiveTabIndexAfterTabDelete(currentTab, tabIndexToDelete);

      // Assert
      expect(result).toEqual("5");
    });
  });
});
