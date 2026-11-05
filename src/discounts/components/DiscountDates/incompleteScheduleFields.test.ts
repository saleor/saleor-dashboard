import {
  getNextIncompleteScheduleFields,
  type ScheduleDateField,
} from "./incompleteScheduleFields";

const input = (
  name: string,
  badInput: boolean,
): { name: string; validity: Pick<ValidityState, "badInput"> } => ({
  name,
  validity: { badInput },
});

describe("getNextIncompleteScheduleFields", () => {
  it("adds a partly filled input", () => {
    // Arrange
    const current: ScheduleDateField[] = ["startTime"];

    // Act
    const next = getNextIncompleteScheduleFields(current, input("endDate", true));

    // Assert
    expect(next).toEqual(["startTime", "endDate"]);
  });

  it("removes an input once it is complete or empty", () => {
    // Arrange
    const current: ScheduleDateField[] = ["startTime", "endDate"];

    // Act
    const next = getNextIncompleteScheduleFields(current, input("endDate", false));

    // Assert
    expect(next).toEqual(["startTime"]);
  });

  it("returns null when nothing changed", () => {
    // Arrange
    const current: ScheduleDateField[] = ["endDate"];

    // Act
    const stillIncomplete = getNextIncompleteScheduleFields(current, input("endDate", true));
    const stillComplete = getNextIncompleteScheduleFields(current, input("startDate", false));

    // Assert
    expect(stillIncomplete).toBeNull();
    expect(stillComplete).toBeNull();
  });

  it("ignores inputs that are not schedule dates or times", () => {
    // Arrange
    const current: ScheduleDateField[] = [];

    // Act
    const next = getNextIncompleteScheduleFields(current, input("name", true));

    // Assert
    expect(next).toBeNull();
  });
});
