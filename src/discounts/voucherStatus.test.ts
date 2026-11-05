import { type VoucherScheduleDateData } from "./components/VoucherChannelAvailabilityCard/getVoucherSchedulePhase";
import {
  getVoucherFormStatus,
  getVoucherStatus,
  getVoucherStatusTimeParts,
  isVoucherUsageLimitReached,
} from "./voucherStatus";

const now = new Date("2026-11-05T12:00:00Z");

interface SavedVoucherStatusInput {
  startDate: string;
  endDate: string | null;
  now: Date;
}

const running: SavedVoucherStatusInput = {
  startDate: "2026-01-01T00:00:00Z",
  endDate: null,
  now,
};

describe("getVoucherStatus", () => {
  it("is used up once uses reach the usage limit", () => {
    // Arrange & Act
    const atLimit = getVoucherStatus({ ...running, usageLimit: 5, used: 5 });
    const zeroLimit = getVoucherStatus({ ...running, usageLimit: 0, used: 0 });

    // Assert
    expect(atLimit).toBe("usedUp");
    expect(zeroLimit).toBe("usedUp");
  });

  it("follows the schedule while uses are left or there is no limit", () => {
    // Arrange & Act
    const usesLeft = getVoucherStatus({ ...running, usageLimit: 5, used: 4 });
    const noLimit = getVoucherStatus({ ...running, usageLimit: null, used: 40 });

    // Assert
    expect(usesLeft).toBe("active");
    expect(noLimit).toBe("active");
  });

  it("keeps a voucher that hasn't started scheduled, as the API's status filter does", () => {
    // Arrange & Act
    const status = getVoucherStatus({
      ...running,
      startDate: "2027-01-01T00:00:00Z",
      usageLimit: 0,
      used: 0,
    });

    // Assert
    expect(status).toBe("scheduled");
  });

  it("keeps an ended voucher ended", () => {
    // Arrange & Act
    const status = getVoucherStatus({
      ...running,
      endDate: "2026-06-01T00:00:00Z",
      usageLimit: 1,
      used: 1,
    });

    // Assert
    expect(status).toBe("finished");
  });
});

describe("getVoucherFormStatus", () => {
  const scheduleData: VoucherScheduleDateData = {
    startDate: "2026-01-01",
    startTime: "00:00",
    hasEndDate: false,
    endDate: "",
    endTime: "",
  };

  it("uses the same order as the saved status", () => {
    // Arrange & Act
    const usedUp = getVoucherFormStatus({
      scheduleData,
      usageLimitReached: true,
      nowMs: now.getTime(),
    });
    const scheduled = getVoucherFormStatus({
      scheduleData: { ...scheduleData, startDate: "2027-01-01" },
      usageLimitReached: true,
      nowMs: now.getTime(),
    });
    const ended = getVoucherFormStatus({
      scheduleData: { ...scheduleData, hasEndDate: true, endDate: "2026-06-01", endTime: "00:00" },
      usageLimitReached: true,
      nowMs: now.getTime(),
    });

    // Assert
    expect(usedUp).toBe("usedUp");
    expect(scheduled).toBe("scheduled");
    expect(ended).toBe("finished");
  });
});

describe("isVoucherUsageLimitReached", () => {
  it("reads a whole-number limit typed into the form", () => {
    // Arrange & Act & Assert
    expect(isVoucherUsageLimitReached({ usageLimit: "3", used: 3 })).toBe(true);
    expect(isVoucherUsageLimitReached({ usageLimit: "4", used: 3 })).toBe(false);
  });

  it("ignores an empty or invalid typed limit", () => {
    // Arrange & Act & Assert
    expect(isVoucherUsageLimitReached({ usageLimit: "", used: 3 })).toBe(false);
    expect(isVoucherUsageLimitReached({ usageLimit: " ", used: 0 })).toBe(false);
    expect(isVoucherUsageLimitReached({ usageLimit: "-1", used: 0 })).toBe(false);
    expect(isVoucherUsageLimitReached({ usageLimit: "0.5", used: 0 })).toBe(false);
  });
});

describe("getVoucherStatusTimeParts", () => {
  it("gives no time hint for a used-up voucher", () => {
    // Arrange & Act
    const timeParts = getVoucherStatusTimeParts({
      status: "usedUp",
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-12-01T00:00:00Z",
      now,
    });

    // Assert
    expect(timeParts).toBeNull();
  });
});
