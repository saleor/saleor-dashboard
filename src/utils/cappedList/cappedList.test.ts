import { cappedListItems } from "./cappedList";

const formatOthers = (count: number): string => `${count} others`;

describe("cappedListItems", () => {
  it("keeps short lists as they are", () => {
    // Arrange
    const items: string[] = ["A", "B"];

    // Act
    const capped = cappedListItems({ items, formatOthers });

    // Assert
    expect(capped).toEqual(["A", "B"]);
  });

  it("names the first items and counts the rest", () => {
    // Arrange
    const items: string[] = ["A", "B", "C", "D", "E", "F", "G"];

    // Act
    const capped = cappedListItems({ items, formatOthers });

    // Assert
    expect(capped).toEqual(["A", "B", "C", "D", "E", "2 others"]);
  });
});
