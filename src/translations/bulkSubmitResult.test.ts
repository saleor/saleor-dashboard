import {
  createBulkSubmitResult,
  fieldErrorsToRecord,
  mapEntityMutationErrors,
  mapScopedMutationErrors,
} from "./bulkSubmitResult";

describe("bulkSubmitResult", () => {
  it("maps entity mutation errors to matching field names", () => {
    // Arrange
    const entityFields = [
      { name: "title", displayName: "Title" },
      { name: "content", displayName: "Content" },
    ];

    // Act
    const result = mapEntityMutationErrors(
      [{ field: "title", message: "Title is too long" }],
      entityFields as never,
      "Unknown error",
    );

    // Assert
    expect(result).toEqual([{ fieldName: "title", message: "Title is too long" }]);
  });

  it("maps scoped mutation errors to the submitted field", () => {
    // Act
    const result = mapScopedMutationErrors(
      [{ field: "plainText", message: "Invalid value" }],
      "attribute-value-id",
      "Unknown error",
    );

    // Assert
    expect(result).toEqual([{ fieldName: "attribute-value-id", message: "Invalid value" }]);
  });

  it("creates bulk submit result with hasErrors flag", () => {
    // Act
    const result = createBulkSubmitResult([{ fieldName: "title", message: "Required" }]);

    // Assert
    expect(result.hasErrors).toBe(true);
    expect(fieldErrorsToRecord(result.fieldErrors)).toEqual({
      title: "Required",
    });
  });

  it("assigns fieldless entity errors to all entity fields", () => {
    // Arrange
    const entityFields = [
      { name: "name", displayName: "Name" },
      { name: "description", displayName: "Description" },
    ];

    // Act
    const result = mapEntityMutationErrors(
      [{ field: null, message: "GraphQL error" }],
      entityFields as never,
      "Unknown error",
    );

    // Assert
    expect(result).toEqual([
      { fieldName: "name", message: "GraphQL error" },
      { fieldName: "description", message: "GraphQL error" },
    ]);
  });
});
