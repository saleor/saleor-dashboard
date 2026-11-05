import { getVoucherStatus, isVoucherUsageLimitReached } from "./voucherStatus";

describe("getVoucherStatus", () => {
  const now = new Date("2026-11-05T12:00:00Z");
  const running = {
    startDate: "2026-01-01T00:00:00Z",
    endDate: null,
    now,
  };

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
    const scheduled = getVoucherStatus({
      ...running,
      startDate: "2027-01-01T00:00:00Z",
      usageLimit: null,
      used: 0,
    });

    // Assert
    expect(usesLeft).toBe("active");
    expect(noLimit).toBe("active");
    expect(scheduled).toBe("scheduled");
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

describe("isVoucherUsageLimitReached", () => {
  it("reads a limit typed into the form", () => {
    // Arrange & Act
    const reached = isVoucherUsageLimitReached({ usageLimit: "3", used: 3 });
    const notReached = isVoucherUsageLimitReached({ usageLimit: "4", used: 3 });
    const empty = isVoucherUsageLimitReached({ usageLimit: "", used: 3 });

    // Assert
    expect(reached).toBe(true);
    expect(notReached).toBe(false);
    expect(empty).toBe(false);
  });
});
