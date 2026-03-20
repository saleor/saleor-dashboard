import { fuzzySearch, joinDateTime, splitDateTime } from "@dashboard/misc";

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
