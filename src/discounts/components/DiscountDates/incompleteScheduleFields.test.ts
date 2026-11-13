import {
  getNextIncompleteScheduleFields,
  getUnfinishedScheduleFields,
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

describe("getUnfinishedScheduleFields", () => {
  const schedule = {
    startDate: "2026-07-01",
    startTime: "10:00",
    hasEndDate: true,
    endDate: "2026-07-31",
    endTime: "10:00",
  };

  it("counts a partly typed field only while it reports an empty value", () => {
    // Arrange
    const partlyTyped = { ...schedule, startTime: "" };

    // Act
    const stillEmpty = getUnfinishedScheduleFields(partlyTyped, ["startTime"]);
    const typedAgain = getUnfinishedScheduleFields(schedule, ["startTime"]);

    // Assert
    expect(stillEmpty).toEqual(["startTime"]);
    expect(typedAgain).toEqual([]);
  });

  it("counts a date whose year is still being typed", () => {
    // Arrange
    const shortYears = { ...schedule, startDate: "0202-07-01", endDate: "0111-07-31" };

    // Act
    const unfinished = getUnfinishedScheduleFields(shortYears);

    // Assert
    expect(unfinished).toEqual(["startDate", "endDate"]);
  });

  it("ignores end fields while the end date is off", () => {
    // Arrange
    const endOff = { ...schedule, hasEndDate: false, endDate: "0111-07-31", endTime: "" };

    // Act
    const unfinished = getUnfinishedScheduleFields(endOff, ["endTime"]);

    // Assert
    expect(unfinished).toEqual([]);
  });
});
