import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import Wrapper from "@test/wrapper";
import { act, render } from "@testing-library/react";

import {
  type ConnectionCheckResult,
  type ConnectionMonitor,
  createConnectionMonitor,
} from "../../connectionMonitor";
import { createTestClock } from "../../createTestClock";
import { ConnectionRecovery } from "./ConnectionRecovery";

interface FakeQuery {
  result: { error?: unknown; loading: boolean };
  getCurrentResult: () => { error?: unknown; loading: boolean };
  getLastError: () => unknown;
  refetch: jest.Mock<Promise<unknown>, []>;
}

const mockNotify = jest.fn();
const mockQueries = new Map<string, FakeQuery>();

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

/** One request fails, and the check a second later gets an answer. */
const failOnce = async ({ monitor, clock, check }: Setup): Promise<void> => {
  check.mockResolvedValueOnce(answered);
  await act(async () => {
    monitor.reportFailure({ httpStatus: 503, retryAfterMs: null });
    await clock.advance(1_000);
  });
};

describe("ConnectionRecovery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueries.clear();
  });

  it("reloads a query that failed once Saleor answers, with no banner on screen", async () => {
    // Arrange
    const s = setup();
    const query = failedQuery();

    mockQueries.set("1", query);
    render(<ConnectionRecovery monitor={s.monitor} />, { wrapper: Wrapper });

    // Act
    await failOnce(s);

    // Assert
    expect(s.monitor.isBannerAttached()).toBe(false);
    expect(query.refetch).toHaveBeenCalledTimes(1);
    expect(loadFailedToasts()).toHaveLength(0);
  });

  it("says once that some data couldn't load when a query keeps failing while Saleor answers", async () => {
    // Arrange
    const s = setup();
    const query = failedQuery();

    mockQueries.set("1", query);
    render(<ConnectionRecovery monitor={s.monitor} />, { wrapper: Wrapper });

    // Act
    for (let i = 0; i < 3; i++) {
      await failOnce(s);
    }

    // Assert
    expect(query.refetch).toHaveBeenCalledTimes(1);
    expect(loadFailedToasts()).toEqual([
      [expect.objectContaining({ status: "error", text: "Reload the page to try again." })],
    ]);
  });
});
