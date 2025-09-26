import { Ripple } from "@dashboard/ripples/types";

import { getRipplesSortedAndGroupedByMonths } from "./AllRipplesModal";

describe("getRipplesSortedAndGroupedByMonths", () => {
  // Arrange
  const createMockRipple = (id: string, dateAdded: Date): Ripple => ({
    ID: id,
    dateAdded,
    content: {
      oneLiner: `One liner for ${id}`,
      global: `Global content for ${id}`,
      contextual: `Contextual content for ${id}`,
    },
    TTL_seconds: 30,
  });

  it("should return empty object for empty array", () => {
    // Arrange
    const ripples: Ripple[] = [];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(result).toEqual({});
  });

  it("should group ripples by month and year", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 15)), // January 2024
      createMockRipple("ripple2", new Date(2024, 1, 20)), // February 2024
      createMockRipple("ripple3", new Date(2024, 0, 10)), // January 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024 January"]).toHaveLength(2);
    expect(result["2024 February"]).toHaveLength(1);
  });

  it("should sort ripples by date in descending order (newest first)", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 10)), // January 10, 2024
      createMockRipple("ripple2", new Date(2024, 0, 20)), // January 20, 2024
      createMockRipple("ripple3", new Date(2024, 0, 15)), // January 15, 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    const januaryRipples = result["2024 January"];

    expect(januaryRipples[0].ripple.ID).toBe("ripple2"); // January 20 (newest)
    expect(januaryRipples[1].ripple.ID).toBe("ripple3"); // January 15
    expect(januaryRipples[2].ripple.ID).toBe("ripple1"); // January 10 (oldest)
  });

  it("should create correct month keys and date displays", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 0, 15)), // January 2024
      createMockRipple("ripple2", new Date(2023, 11, 20)), // December 2023
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(result["2024 January"]).toBeDefined();
    expect(result["2023 December"]).toBeDefined();

    expect(result["2024 January"][0].dateDisplay).toBe("January 2024");
    expect(result["2023 December"][0].dateDisplay).toBe("December 2023");
  });

  it("should handle ripples from different years correctly", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("ripple1", new Date(2024, 5, 15)), // June 2024
      createMockRipple("ripple2", new Date(2023, 5, 20)), // June 2023
      createMockRipple("ripple3", new Date(2025, 5, 10)), // June 2025
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(3);
    expect(result["2024 June"]).toHaveLength(1);
    expect(result["2023 June"]).toHaveLength(1);
    expect(result["2025 June"]).toHaveLength(1);
  });

  it("should preserve original ripple data in the result", () => {
    // Arrange
    const originalRipple = createMockRipple("test-ripple", new Date(2024, 0, 15));
    const ripples: Ripple[] = [originalRipple];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    const groupedRipple = result["2024 January"][0];

    expect(groupedRipple.ripple).toEqual(originalRipple);
    expect(groupedRipple.ripple.ID).toBe("test-ripple");
    expect(groupedRipple.ripple.content.oneLiner).toBe("One liner for test-ripple");
  });

  it("should handle single ripple correctly", () => {
    // Arrange
    const ripples: Ripple[] = [
      createMockRipple("single-ripple", new Date(2024, 3, 10)), // April 2024
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024 April"]).toHaveLength(1);
    expect(result["2024 April"][0].ripple.ID).toBe("single-ripple");
    expect(result["2024 April"][0].dateDisplay).toBe("April 2024");
  });

  it("should handle ripples with same date correctly", () => {
    // Arrange
    const sameDate = new Date(2024, 2, 15); // March 15, 2024
    const ripples: Ripple[] = [
      createMockRipple("ripple1", sameDate),
      createMockRipple("ripple2", sameDate),
      createMockRipple("ripple3", sameDate),
    ];

    // Act
    const result = getRipplesSortedAndGroupedByMonths(ripples);

    // Assert
    expect(Object.keys(result)).toHaveLength(1);
    expect(result["2024 March"]).toHaveLength(3);
    result["2024 March"].forEach(item => {
      expect(item.dateDisplay).toBe("March 2024");
    });
  });
});
