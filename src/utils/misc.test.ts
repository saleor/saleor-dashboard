import { fuzzySearch } from "@dashboard/misc";

describe("fuzzySearch", () => {
  it("searches for a result in array of objects", () => {
    // Arrange
    const array = [{ name: "banana" }, { name: "apple" }, { name: "orange" }];
    const search = "ban";

    // Act
    const result = fuzzySearch(array, search, ["name"]);

    // Assert
    expect(result).toStrictEqual([{ name: "banana" }]);
  });

  it("returns empty array if no results found", () => {
    // Assert
    const array = [{ name: "banana" }, { name: "apple" }, { name: "orange" }];
    const search = "kiwi";

    // Act
    const result = fuzzySearch(array, search, ["name"]);

    // Assert
    expect(result).toStrictEqual([]);
  });
});
