import { areMetadataArraysEqual } from "./metadataUpdateHelpers";

describe("metadataUpdateHelpers", () => {
  describe("areMetadataArraysEqual", () => {
    it("should return false if before or after is undefined", () => {
      expect(areMetadataArraysEqual(undefined, [])).toBe(false);
      expect(areMetadataArraysEqual([], undefined)).toBe(false);
    });

    it("should return true if arrays are equal", () => {
      const before = [{ key: "key1", value: "value1" }];
      const after = [{ key: "key1", value: "value1" }];

      expect(areMetadataArraysEqual(before, after)).toBe(true);
    });

    it("should return false if arrays are not equal", () => {
      const before = [{ key: "key1", value: "value1" }];
      const after = [{ key: "key2", value: "value2" }];

      expect(areMetadataArraysEqual(before, after)).toBe(false);
    });
  });
});
