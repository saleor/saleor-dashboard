import { getNextUniqueTabName } from "./utils";

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
});
