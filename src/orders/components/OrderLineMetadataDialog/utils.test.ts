import { IntlShape } from "react-intl";

import { getValidateMetadata, mapFieldArrayToMetadataInput } from "./utils";

const mockIntl: IntlShape = {
  formatMessage: jest.fn(({ defaultMessage }) => defaultMessage as string),
} as unknown as IntlShape;

describe("getValidateMetadata", () => {
  it("returns true for valid metadata with unique keys", () => {
    // Arrange
    const metadata = [
      { key: "key1", value: "value1" },
      { key: "key2", value: "value2" },
    ];

    // Act
    const result = getValidateMetadata(mockIntl)(metadata);

    // Assert
    expect(result).toBe(true);
  });

  it("returns error message for duplicate keys", () => {
    // Arrange
    const metadata = [
      { key: "duplicate", value: "value1" },
      { key: "duplicate", value: "value2" },
    ];

    // Act
    const result = getValidateMetadata(mockIntl)(metadata);

    // Assert
    expect(result).toBe("Metadata keys must be unique, remove duplicate key");
    expect(mockIntl.formatMessage).toHaveBeenCalledWith({
      defaultMessage: "Metadata keys must be unique, remove duplicate key",
      description: "metadata edit form, error message",
      id: "MfWHGz",
    });
  });

  it("returns error message for empty keys", () => {
    // Arrange
    const metadata = [
      { key: "", value: "value1" },
      { key: "valid-key", value: "value2" },
    ];

    // Act
    const result = getValidateMetadata(mockIntl)(metadata);

    // Assert
    expect(result).toBe("Metadata key cannot be empty");
    expect(mockIntl.formatMessage).toHaveBeenCalledWith({
      defaultMessage: "Metadata key cannot be empty",
      description: "metadata edit form, error message",
      id: "lb5uDM",
    });
  });

  it("returns true for empty metadata array", () => {
    // Arrange
    const metadata: Array<{ key: string; value: string }> = [];

    // Act
    const result = getValidateMetadata(mockIntl)(metadata);

    // Assert
    expect(result).toBe(true);
  });

  it("prioritizes duplicate key error over empty key error", () => {
    // Arrange
    const metadata = [
      { key: "duplicate", value: "value1" },
      { key: "duplicate", value: "value2" },
      { key: "", value: "value3" },
    ];

    // Act
    const result = getValidateMetadata(mockIntl)(metadata);

    // Assert
    expect(result).toBe("Metadata keys must be unique, remove duplicate key");
  });
});

describe("mapFieldArrayToMetadataInput", () => {
  it("maps field array with id to MetadataInput", () => {
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

  it("removes id field from each item", () => {
    // Arrange
    const fields = [{ id: "field-id", key: "test-key", value: "test-value" }];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result[0]).not.toHaveProperty("id");
    expect(result[0]).toEqual({ key: "test-key", value: "test-value" });
  });

  it("returns empty array for empty input", () => {
    // Arrange
    const fields: Array<Record<"id", string> & { key: string; value: string }> = [];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([]);
  });

  it("handles fields with empty key and value", () => {
    // Arrange
    const fields = [{ id: "field-id", key: "", value: "" }];

    // Act
    const result = mapFieldArrayToMetadataInput(fields);

    // Assert
    expect(result).toEqual([{ key: "", value: "" }]);
  });
});
