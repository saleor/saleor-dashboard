import { parseQs } from "./url-utils";

describe("parseQs", () => {
  describe("arrayLimit", () => {
    it("should parse arrays with up to 100 items", () => {
      // Arrange
      const items = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const queryString = items.map(item => `arr[]=${item}`).join("&");

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(result.arr).toEqual(items);
      expect(Array.isArray(result.arr)).toBe(true);
      expect(result.arr).toHaveLength(100);
    });

    it("should parse arrays with exactly 100 items correctly", () => {
      // Arrange
      const queryString = Array.from({ length: 100 }, (_, i) => `ids[]=${i}`).join("&");

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(Array.isArray(result.ids)).toBe(true);
      expect(result.ids).toHaveLength(100);
      expect((result.ids as string[])[0]).toBe("0");
      expect((result.ids as string[])[99]).toBe("99");
    });

    it("should parse arrays with fewer than 100 items", () => {
      // Arrange
      const queryString = "tags[]=red&tags[]=blue&tags[]=green";

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(result.tags).toEqual(["red", "blue", "green"]);
      expect(Array.isArray(result.tags)).toBe(true);
      expect(result.tags).toHaveLength(3);
    });

    it("should throw if limit is exceeded", () => {
      // Arrange
      const items = Array.from({ length: 999 }, (_, i) => `value${i}`);
      const queryString = items.map(item => `data=${item}`).join("&");

      // Act, Assert
      // Prefer early error to be caught instead of strange conversion
      expect(() => parseQs(queryString, { arrayLimit: 40 })).toThrow();
    });

    it("should handle empty arrays", () => {
      // Arrange
      const queryString = "emptyArray[]=";

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(result.emptyArray).toEqual([""]);
      expect(Array.isArray(result.emptyArray)).toBe(true);
    });

    it("should handle multiple arrays in the same query string", () => {
      // Arrange
      const colors = Array.from({ length: 50 }, (_, i) => `color${i}`);
      const sizes = Array.from({ length: 50 }, (_, i) => `size${i}`);
      const queryString = [
        ...colors.map(c => `colors[]=${c}`),
        ...sizes.map(s => `sizes[]=${s}`),
      ].join("&");

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(Array.isArray(result.colors)).toBe(true);
      expect(result.colors).toHaveLength(50);
      expect(Array.isArray(result.sizes)).toBe(true);
      expect(result.sizes).toHaveLength(50);
    });
  });

  describe("custom options", () => {
    it("should allow overriding arrayLimit through options", () => {
      // Arrange
      const queryString = "items[]=1&items[]=2";

      // Act
      const result = parseQs(queryString, { arrayLimit: 2 });

      // Assert
      // The custom arrayLimit option is passed through to qs.parse
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toEqual(["1", "2"]);
    });

    it("should use default arrayLimit of 100 when no options provided", () => {
      // Arrange
      const items = Array.from({ length: 100 }, (_, i) => `${i}`);
      const queryString = items.map(item => `nums[]=${item}`).join("&");

      // Act
      const result = parseQs(queryString);

      // Assert
      expect(Array.isArray(result.nums)).toBe(true);
      expect(result.nums).toHaveLength(100);
    });
  });
});
