import { getVoucherSchedulePhase } from "./getVoucherSchedulePhase";

jest.mock("@dashboard/misc", () => ({
  joinDateTime: (date: string, time?: string) => {
    if (!date) {
      return null;
    }

    return `${date}T${time || "00:00"}:00.000Z`;
  },
}));

describe("getVoucherSchedulePhase", () => {
  const nowMs = Date.parse("2026-06-15T12:00:00.000Z");

  it("returns scheduled when start is in the future", () => {
    // Arrange
    const data = {
      startDate: "2026-07-01",
      startTime: "10:00",
      hasEndDate: false,
      endDate: "",
      endTime: "",
    };

    // Act & Assert
    expect(getVoucherSchedulePhase(data, nowMs)).toBe("scheduled");
  });

  it("returns active when now is after start and there is no end", () => {
    // Arrange
    const data = {
      startDate: "2026-01-01",
      startTime: "10:00",
      hasEndDate: false,
      endDate: "",
      endTime: "",
    };

    // Act & Assert
    expect(getVoucherSchedulePhase(data, nowMs)).toBe("active");
  });

  it("returns active when now is within start and end", () => {
    // Arrange
    const data = {
      startDate: "2026-01-01",
      startTime: "10:00",
      hasEndDate: true,
      endDate: "2026-12-31",
      endTime: "23:59",
    };

    // Act & Assert
    expect(getVoucherSchedulePhase(data, nowMs)).toBe("active");
  });

  it("returns ended when now is after end", () => {
    // Arrange
    const data = {
      startDate: "2026-01-01",
      startTime: "10:00",
      hasEndDate: true,
      endDate: "2026-06-01",
      endTime: "00:00",
    };

    // Act & Assert
    expect(getVoucherSchedulePhase(data, nowMs)).toBe("ended");
  });

  it("returns active when start date is empty", () => {
    // Arrange
    const data = {
      startDate: "",
      startTime: "",
      hasEndDate: false,
      endDate: "",
      endTime: "",
    };

    // Act & Assert
    expect(getVoucherSchedulePhase(data, nowMs)).toBe("active");
  });
});
