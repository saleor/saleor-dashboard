import {
  getUpdatedIdsWithNewId,
  getUpdatedIdsWithoutNewId,
  parseDateTimeToDateAndTime,
} from "./utils";

describe("ChannelDetailsPage utils", () => {
  describe("getUpdatedIdsWithNewId", () => {
    it("adds new id to empty array", () => {
      // Arrange
      const ids: string[] = [];
      const newId = "id-1";

      // Act
      const result = getUpdatedIdsWithNewId(ids, newId);

      // Assert
      expect(result).toEqual(["id-1"]);
    });

    it("adds new id to existing array", () => {
      // Arrange
      const ids = ["id-1", "id-2"];
      const newId = "id-3";

      // Act
      const result = getUpdatedIdsWithNewId(ids, newId);

      // Assert
      expect(result).toEqual(["id-1", "id-2", "id-3"]);
    });

    it("returns unique ids when adding duplicate id", () => {
      // Arrange
      const ids = ["id-1", "id-2"];
      const newId = "id-2";

      // Act
      const result = getUpdatedIdsWithNewId(ids, newId);

      // Assert
      expect(result).toEqual(["id-1", "id-2"]);
      expect(result.length).toBe(2);
    });

    it("removes duplicates from original array", () => {
      // Arrange
      const ids = ["id-1", "id-2", "id-1"];
      const newId = "id-3";

      // Act
      const result = getUpdatedIdsWithNewId(ids, newId);

      // Assert
      expect(result).toEqual(["id-1", "id-2", "id-3"]);
      expect(result.length).toBe(3);
    });

    it("handles empty string as new id", () => {
      // Arrange
      const ids = ["id-1"];
      const newId = "";

      // Act
      const result = getUpdatedIdsWithNewId(ids, newId);

      // Assert
      expect(result).toEqual(["id-1", ""]);
    });
  });

  describe("getUpdatedIdsWithoutNewId", () => {
    it("removes existing id from array", () => {
      // Arrange
      const ids = ["id-1", "id-2", "id-3"];
      const idToRemove = "id-2";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual(["id-1", "id-3"]);
    });

    it("returns same array when id not found", () => {
      // Arrange
      const ids = ["id-1", "id-2"];
      const idToRemove = "id-3";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual(["id-1", "id-2"]);
    });

    it("returns empty array when removing only id", () => {
      // Arrange
      const ids = ["id-1"];
      const idToRemove = "id-1";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual([]);
    });

    it("removes all occurrences of duplicate id", () => {
      // Arrange
      const ids = ["id-1", "id-2", "id-1", "id-3"];
      const idToRemove = "id-1";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual(["id-2", "id-3"]);
    });

    it("returns empty array when input is empty", () => {
      // Arrange
      const ids: string[] = [];
      const idToRemove = "id-1";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual([]);
    });

    it("handles empty string as id to remove", () => {
      // Arrange
      const ids = ["id-1", "", "id-2"];
      const idToRemove = "";

      // Act
      const result = getUpdatedIdsWithoutNewId(ids, idToRemove);

      // Assert
      expect(result).toEqual(["id-1", "id-2"]);
    });
  });

  describe("parseDateTimeToDateAndTime", () => {
    it("parses valid ISO datetime string", () => {
      // Arrange
      const dateTime = "2024-12-15T14:30:00Z";

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result.date).toBe("2024-12-15");
      expect(result.time).toBe("14:30");
    });

    it("returns empty strings for null input", () => {
      // Arrange
      const dateTime = null;

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result).toEqual({ date: "", time: "" });
    });

    it("returns empty strings for undefined input", () => {
      // Arrange
      const dateTime = undefined;

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result).toEqual({ date: "", time: "" });
    });

    it("returns empty strings for invalid datetime string", () => {
      // Arrange
      const dateTime = "invalid-date";

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result).toEqual({ date: "", time: "" });
    });

    it("returns empty strings for empty string", () => {
      // Arrange
      const dateTime = "";

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result).toEqual({ date: "", time: "" });
    });

    it("parses datetime with milliseconds", () => {
      // Arrange
      const dateTime = "2024-12-15T14:30:45.123Z";

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result.date).toBe("2024-12-15");
      expect(result.time).toBe("14:30");
    });

    it("returns time in HH:MM format", () => {
      // Arrange
      const dateTime = "2024-12-15T09:05:00Z";

      // Act
      const result = parseDateTimeToDateAndTime(dateTime);

      // Assert
      expect(result.time).toBe("09:05");
      // Time format should be exactly 5 characters (HH:MM)
      expect(result.time.length).toBe(5);
    });
  });
});
