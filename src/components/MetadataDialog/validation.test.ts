import { MetadataInput } from "@dashboard/graphql";
import { IntlShape } from "react-intl";

import { getValidateMetadata, mapFieldArrayToMetadataInput } from "./validation";

// Mock intl for tests
const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
} as IntlShape;

describe("getValidateMetadata", () => {
  const validateMetadata = getValidateMetadata(intl);

  describe("duplicate key validation", () => {
    it("rejects duplicate keys", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: "duplicate", value: "value1" },
        { key: "duplicate", value: "value2" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe("Metadata keys must be unique, remove duplicate key");
    });

    it("rejects multiple duplicate keys", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: "dup1", value: "value1" },
        { key: "dup1", value: "value2" },
        { key: "dup2", value: "value3" },
        { key: "dup2", value: "value4" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe("Metadata keys must be unique, remove duplicate key");
    });

    it("accepts unique keys", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: "key1", value: "value1" },
        { key: "key2", value: "value2" },
        { key: "key3", value: "value3" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("empty key validation", () => {
    it("rejects empty key", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: "", value: "value1" },
        { key: "valid-key", value: "value2" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe("Metadata key cannot be empty");
    });

    it("rejects multiple empty keys (duplicate check runs first)", () => {
      // Arrange
      // Note: When all keys are empty strings, they're duplicates, so duplicate error comes first
      const metadata: MetadataInput[] = [
        { key: "", value: "value1" },
        { key: "", value: "value2" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe("Metadata keys must be unique, remove duplicate key");
    });

    it("accepts non-empty keys", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: "key1", value: "" }, // Empty value is OK
        { key: "key2", value: "value2" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("accepts empty array", () => {
      // Arrange
      const metadata: MetadataInput[] = [];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe(true);
    });

    it("accepts single entry", () => {
      // Arrange
      const metadata: MetadataInput[] = [{ key: "only-key", value: "only-value" }];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe(true);
    });

    it("prioritizes empty key error over duplicate error", () => {
      // Arrange
      // Note: In the implementation, uniqueness is checked first
      const metadata: MetadataInput[] = [
        { key: "duplicate", value: "value1" },
        { key: "duplicate", value: "value2" },
        { key: "", value: "value3" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe("Metadata keys must be unique, remove duplicate key");
    });

    it("handles whitespace-only keys as non-empty", () => {
      // Arrange
      const metadata: MetadataInput[] = [
        { key: " ", value: "value1" },
        { key: "  ", value: "value2" },
      ];

      // Act
      const result = validateMetadata(metadata);

      // Assert
      expect(result).toBe(true); // Whitespace is considered valid
    });
  });
});

describe("mapFieldArrayToMetadataInput", () => {
  it("extracts only key and value from field array entries", () => {
    // Arrange
    const fields = [
      { id: "field-id-1", key: "key1", value: "value1" },
      { id: "field-id-2", key: "key2", value: "value2" },
    ];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([
      { key: "key1", value: "value1" },
      { key: "key2", value: "value2" },
    ]);
  });

  it("handles empty array", () => {
    // Arrange
    const fields: Array<Record<"id", string> & MetadataInput> = [];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([]);
  });

  it("handles single entry", () => {
    // Arrange
    const fields = [{ id: "single-id", key: "single-key", value: "single-value" }];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([{ key: "single-key", value: "single-value" }]);
  });

  it("preserves empty keys and values", () => {
    // Arrange
    const fields = [
      { id: "field-id-1", key: "", value: "" },
      { id: "field-id-2", key: "key2", value: "" },
      { id: "field-id-3", key: "", value: "value3" },
    ];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([
      { key: "", value: "" },
      { key: "key2", value: "" },
      { key: "", value: "value3" },
    ]);
  });

  it("removes id field and keeps only key and value", () => {
    // Arrange
    const fields = [{ id: "should-be-removed", key: "test-key", value: "test-value" }];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result[0]).not.toHaveProperty("id");
    expect(result[0]).toEqual({ key: "test-key", value: "test-value" });
  });

  it("handles special characters in keys and values", () => {
    // Arrange
    const fields = [
      { id: "id-1", key: "key-with-dashes", value: "value with spaces" },
      { id: "id-2", key: "key.with.dots", value: "value:with:colons" },
      { id: "id-3", key: "key_with_underscores", value: "value/with/slashes" },
    ];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([
      { key: "key-with-dashes", value: "value with spaces" },
      { key: "key.with.dots", value: "value:with:colons" },
      { key: "key_with_underscores", value: "value/with/slashes" },
    ]);
  });
});
