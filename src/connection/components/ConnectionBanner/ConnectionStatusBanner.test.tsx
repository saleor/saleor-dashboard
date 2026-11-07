import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
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

interface FakeQuery {
  result: { error?: unknown; loading: boolean };
  getCurrentResult: () => { error?: unknown; loading: boolean };
  getLastError: () => unknown;
  refetch: jest.Mock<Promise<unknown>, []>;
}

const mockTrackEvent = jest.fn();
const mockNotify = jest.fn();
const mockQueries = new Map<string, FakeQuery>();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));
jest.mock("@apollo/client", () => {
  const client = { getObservableQueries: (): Map<string, FakeQuery> => mockQueries };

  return {
    ...jest.requireActual<typeof ApolloClientModule>("@apollo/client"),
    useApolloClient: (): typeof client => client,
  };
});

const failedQuery = (): FakeQuery => {
  const fake: FakeQuery = {
    result: {
      error: new ApolloError({ networkError: new TypeError("Failed to fetch") }),
      loading: false,
    },
    getCurrentResult: () => fake.result,
    getLastError: () => undefined,
    refetch: jest.fn(() => Promise.resolve({})),
  };

  return fake;
};

// The test wrapper's own queries also notify; count only the toast this component shows.
const loadFailedToasts = (): unknown[] =>
  mockNotify.mock.calls.filter(
    ([notification]) => notification.title === "Couldn't load some data",
  );

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
    mockQueries.clear();
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

  it("reloads a query that failed once Saleor answers, without a toast", async () => {
    // Arrange
    const s = setup();
    const query = failedQuery();

    mockQueries.set("1", query);
    render(<ConnectionStatusBanner monitor={s.monitor} />, { wrapper: Wrapper });

    // Act
    await failOnce(s, answered);

    // Assert
    expect(query.refetch).toHaveBeenCalledTimes(1);
    expect(loadFailedToasts()).toHaveLength(0);
  });

  it("says once that some data couldn't load when a query keeps failing while Saleor answers", async () => {
    // Arrange
    const s = setup();
    const query = failedQuery();

    mockQueries.set("1", query);
    render(<ConnectionStatusBanner monitor={s.monitor} />, { wrapper: Wrapper });

    // Act
    for (let i = 0; i < 3; i++) {
      await failOnce(s, answered);
    }

    // Assert
    expect(query.refetch).toHaveBeenCalledTimes(1);
    expect(loadFailedToasts()).toEqual([
      [expect.objectContaining({ status: "error", text: "Reload the page to try again." })],
    ]);
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
