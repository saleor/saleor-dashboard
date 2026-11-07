import Wrapper from "@test/wrapper";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  type ConnectionCheckResult,
  type ConnectionMonitor,
  createConnectionMonitor,
} from "../../connectionMonitor";
import { createTestClock } from "../../createTestClock";
import { getOutageDurationBucket } from "../../getOutageDurationBucket";
import { ConnectionStatusBanner } from "./ConnectionStatusBanner";

const mockTrackEvent = jest.fn();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));

interface Setup {
  monitor: ConnectionMonitor;
  clock: ReturnType<typeof createTestClock>;
  check: jest.Mock<Promise<ConnectionCheckResult>, []>;
}

const answered: ConnectionCheckResult = { ok: true };
const unanswered: ConnectionCheckResult = {
  ok: false,
  failure: { httpStatus: 503, retryAfterMs: null },
};

const setup = (): Setup => {
  const clock = createTestClock();
  const check = jest.fn<Promise<ConnectionCheckResult>, []>();
  const monitor = createConnectionMonitor({
    check,
    isBrowserOnline: () => true,
    isPageVisible: () => true,
    now: clock.now,
    random: () => 0.5,
    timers: clock.timers,
    reportError: jest.fn(),
  });

  return { monitor, clock, check };
};

/** One request fails, and the check a second later gives `result`. */
const failOnce = async (
  { monitor, clock, check }: Setup,
  result: ConnectionCheckResult,
): Promise<void> => {
  check.mockResolvedValueOnce(result);
  await act(async () => {
    monitor.reportFailure({ httpStatus: 503, retryAfterMs: null });
    await clock.advance(1_000);
  });
};

describe("ConnectionStatusBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows an outage, recovers on Try now, and records both in analytics", async () => {
    // Arrange
    const s = setup();

    render(<ConnectionStatusBanner monitor={s.monitor} />, { wrapper: Wrapper });
    await failOnce(s, unanswered);

    const duringOutage = screen.getByRole("alert").textContent;

    s.check.mockResolvedValueOnce(answered);

    // Act
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Try now" }));
      await s.clock.settle();
    });

    // Assert
    expect(duringOutage).toContain("Can't reach Saleor.");
    expect(screen.getByRole("status")).toHaveTextContent("Connected again.");
    expect(mockTrackEvent).toHaveBeenCalledWith("connection_lost", {
      cause: "unreachable",
      http_status: 503,
    });
    expect(mockTrackEvent).toHaveBeenCalledWith("connection_restored", {
      cause: "unreachable",
      duration: "0-10s",
      try_now_count: 1,
    });
  });

  it("doesn't record a recovery from an outage that started before it was on screen", async () => {
    // Arrange
    const s = setup();

    await failOnce(s, unanswered);
    render(<ConnectionStatusBanner monitor={s.monitor} />, { wrapper: Wrapper });

    // Act
    act(() => s.monitor.reportSuccess());

    // Assert
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("tells the monitor it is on screen only while mounted", () => {
    // Arrange
    const s = setup();
    const { unmount } = render(<ConnectionStatusBanner monitor={s.monitor} />, {
      wrapper: Wrapper,
    });
    const whileMounted = s.monitor.isBannerAttached();

    // Act
    unmount();

    // Assert
    expect(whileMounted).toBe(true);
    expect(s.monitor.isBannerAttached()).toBe(false);
  });
});

describe("getOutageDurationBucket", () => {
  it("groups outage lengths for analytics", () => {
    // Arrange
    const durations = [9_999, 10_000, 59_999, 60_000, 299_999, 300_000];

    // Act
    const buckets = durations.map(getOutageDurationBucket);

    // Assert
    expect(buckets).toEqual(["0-10s", "10-60s", "10-60s", "1-5m", "1-5m", "5m+"]);
  });
});
