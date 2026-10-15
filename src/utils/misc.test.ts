import { type FetchResult } from "@apollo/client";
import {
  extractMutationErrors,
  fuzzySearch,
  getMutationErrors,
  joinDateTime,
  splitDateTime,
} from "@dashboard/misc";
import { GraphQLError } from "graphql";

interface SaveError {
  field: string;
  message: string;
}

interface SaveResult {
  update: {
    errors: SaveError[];
    results?: Array<{ errors: SaveError[] }>;
  } | null;
}

describe("getMutationErrors", () => {
  it("returns GraphQL execution errors when the response has no data", () => {
    // Arrange
    const error = new GraphQLError("Permission denied");
    const result: FetchResult<SaveResult> = { errors: [error] };

    // Act
    const errors = getMutationErrors(result);

    // Assert
    expect(errors).toEqual([error]);
  });

  it("preserves execution and validation errors from a partial response", () => {
    // Arrange
    const executionError = new GraphQLError("A field could not be resolved");
    const validationError: SaveError = { field: "name", message: "Invalid name" };
    const result: FetchResult<SaveResult> = {
      data: { update: { errors: [validationError] } },
      errors: [executionError],
    };

    // Act
    const errors = getMutationErrors(result);

    // Assert
    expect(errors).toEqual([executionError, validationError]);
  });

  it("handles a null mutation payload with an execution error", async () => {
    // Arrange
    const error = new GraphQLError("Permission denied");
    const result: FetchResult<SaveResult> = { data: { update: null }, errors: [error] };

    // Act
    const errors = await extractMutationErrors(Promise.resolve(result));

    // Assert
    expect(errors).toEqual([error]);
  });

  it("collects validation errors from bulk results", () => {
    // Arrange
    const error: SaveError = { field: "name", message: "Invalid name" };
    const result: FetchResult<SaveResult> = {
      data: { update: { errors: [], results: [{ errors: [error] }] } },
    };

    // Act
    const errors = getMutationErrors(result);

    // Assert
    expect(errors).toEqual([error]);
  });

  it("returns no errors for a successful response", () => {
    // Arrange
    const result: FetchResult<SaveResult> = { data: { update: { errors: [] } } };

    // Act
    const errors = getMutationErrors(result);

    // Assert
    expect(errors).toEqual([]);
  });

  it("returns no errors before a mutation has data or errors", () => {
    // Arrange
    const result: FetchResult<SaveResult> = {};

    // Act
    const errors = getMutationErrors(result);

    // Assert
    expect(errors).toEqual([]);
  });
});

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

describe("joinDateTime", () => {
  it("combines date and time into an ISO string", () => {
    // Arrange
    const date = "2024-01-15";
    const time = "14:30";

    // Act
    const result = joinDateTime(date, time);

    // Assert
    expect(result).toBe("2024-01-15T14:30:00+00:00");
  });

  it("defaults to 00:00 when time is not provided", () => {
    // Arrange
    const date = "2024-01-15";

    // Act
    const result = joinDateTime(date);

    // Assert
    expect(result).toBe("2024-01-15T00:00:00+00:00");
  });

  it("returns null for empty date string", () => {
    // Act
    const result = joinDateTime("");

    // Assert
    expect(result).toBeNull();
  });

  it("handles end-of-day time correctly", () => {
    // Arrange
    const date = "2024-06-15";
    const time = "23:59";

    // Act
    const result = joinDateTime(date, time);

    // Assert
    expect(result).toBe("2024-06-15T23:59:00+00:00");
  });
});

describe("splitDateTime", () => {
  it("splits ISO datetime into date and time parts", () => {
    // Arrange
    const dateTime = "2024-01-15T14:30:00Z";

    // Act
    const result = splitDateTime(dateTime);

    // Assert
    expect(result).toEqual({ date: "2024-01-15", time: "14:30" });
  });

  it("returns empty strings for empty input", () => {
    // Act
    const result = splitDateTime("");

    // Assert
    expect(result).toEqual({ date: "", time: "" });
  });

  it("splits midnight datetime correctly", () => {
    // Arrange
    const dateTime = "2024-06-15T00:00:00Z";

    // Act
    const result = splitDateTime(dateTime);

    // Assert
    expect(result).toEqual({ date: "2024-06-15", time: "00:00" });
  });
});
