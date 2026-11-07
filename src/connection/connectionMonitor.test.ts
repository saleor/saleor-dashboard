import { type ConnectionFailure } from "./connectionErrors";
import {
  type ConnectionCheckResult,
  type ConnectionEvent,
  type ConnectionMonitor,
  createConnectionMonitor,
} from "./connectionMonitor";
import { createTestClock } from "./createTestClock";

const proxy503: ConnectionFailure = { httpStatus: 503, retryAfterMs: null };
const noResponse: ConnectionFailure = { httpStatus: 0, retryAfterMs: null };
const answered: ConnectionCheckResult = { ok: true };
const unanswered: ConnectionCheckResult = { ok: false, failure: proxy503 };

interface Setup {
  monitor: ConnectionMonitor;
  clock: ReturnType<typeof createTestClock>;
  check: jest.Mock<Promise<ConnectionCheckResult>, []>;
  checkTimes: number[];
  events: ConnectionEvent[];
  browser: { online: boolean; visible: boolean };
  reportError: jest.Mock<void, [unknown]>;
}

const setup = ({ random = 0.5 }: { random?: number } = {}): Setup => {
  const clock = createTestClock();
  const browser = { online: true, visible: true };
  const checkTimes: number[] = [];
  const check = jest.fn<Promise<ConnectionCheckResult>, []>(async () => {
    checkTimes.push(clock.now());

    return unanswered;
  });
  const reportError = jest.fn<void, [unknown]>();
  const monitor = createConnectionMonitor({
    check,
    isBrowserOnline: () => browser.online,
    isPageVisible: () => browser.visible,
    now: clock.now,
    random: () => random,
    timers: clock.timers,
    reportError,
  });
  const events: ConnectionEvent[] = [];

  monitor.subscribe(event => events.push(event));

  return { monitor, clock, check, checkTimes, events, browser, reportError };
};

const statusOf = ({ monitor }: Setup): string => monitor.stateVar().status;

describe("connection monitor", () => {
  it("shows nothing for a single failed request when the check a second later gets an answer", async () => {
    // Arrange
    const s = setup();

    s.check.mockResolvedValueOnce(answered);

    // Act
    s.monitor.reportFailure(noResponse);
    await s.clock.advance(999);

    const beforeCheck = statusOf(s);

    await s.clock.advance(1);

    // Assert
    expect(beforeCheck).toBe("suspect");
    expect(statusOf(s)).toBe("online");
    expect(s.events).toEqual([{ type: "recovered", afterOutage: false }]);
  });

  it("shows the outage once the check a second later fails too", async () => {
    // Arrange
    const s = setup();

    // Act
    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1000);

    // Assert
    expect(statusOf(s)).toBe("unreachable");
    expect(s.events).toEqual([
      { type: "lost", outageId: 1, cause: "unreachable", httpStatus: 503 },
    ]);
  });

  it("checks again after 2, 4, 8 and 16 seconds, then every 30 seconds", async () => {
    // Arrange
    const s = setup();

    // Act
    s.monitor.reportFailure(noResponse);
    await s.clock.advance(100_000);

    // Assert
    expect(s.checkTimes).toEqual([1_000, 3_000, 7_000, 15_000, 31_000, 61_000, 91_000]);
  });

  it("varies each delay by up to a fifth either way", async () => {
    // Arrange
    const early = setup({ random: 0 });
    const late = setup({ random: 1 });

    // Act
    for (const s of [early, late]) {
      s.monitor.reportFailure(noResponse);
      await s.clock.advance(5_000);
    }

    // Assert
    expect(early.checkTimes.slice(0, 2)).toEqual([1_000, 2_600]);
    expect(late.checkTimes.slice(0, 2)).toEqual([1_000, 3_400]);
  });

  it("waits as long as Retry-After asks, up to two minutes", async () => {
    // Arrange
    const polite = setup();
    const greedy = setup();

    for (const [s, retryAfterMs] of [
      [polite, 60_000],
      [greedy, 3_600_000],
    ] as const) {
      s.check.mockImplementation(async () => {
        s.checkTimes.push(s.clock.now());

        return { ok: false, failure: { httpStatus: 503, retryAfterMs } };
      });
    }

    // Act
    for (const s of [polite, greedy]) {
      s.monitor.reportFailure(proxy503);
      await s.clock.advance(200_000);
    }

    // Assert
    expect(polite.checkTimes.slice(0, 2)).toEqual([1_000, 61_000]);
    expect(greedy.checkTimes.slice(0, 2)).toEqual([1_000, 121_000]);
  });

  it("says connected again on the first answer from Saleor, then hides after three seconds", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(5_000);

    // Act
    s.monitor.reportSuccess();

    const restored = statusOf(s);

    await s.clock.advance(3_000);

    // Assert
    expect(restored).toBe("restored");
    expect(statusOf(s)).toBe("online");
    expect(s.events).toContainEqual({
      type: "restored",
      outageId: 1,
      cause: "unreachable",
      durationMs: 4_000,
      tryNowCount: 0,
    });
    expect(s.events[s.events.length - 1]).toEqual({ type: "recovered", afterOutage: true });
  });

  it("checks right away on Try now and starts the schedule again", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(20_000);

    let release: (result: ConnectionCheckResult) => void = () => undefined;

    s.check.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          s.checkTimes.push(s.clock.now());
          release = resolve;
        }),
    );

    // Act
    s.monitor.checkNow();

    const whileChecking = s.monitor.stateVar().checkingNow;

    release(unanswered);
    await s.clock.settle();
    await s.clock.advance(2_000);

    // Assert
    expect(whileChecking).toBe(true);
    expect(s.monitor.stateVar().checkingNow).toBe(false);
    expect(s.checkTimes.slice(-2)).toEqual([20_000, 22_000]);
  });

  it("counts Try now presses in the restored event", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1_000);
    s.check.mockResolvedValueOnce(answered);

    // Act
    s.monitor.checkNow();
    await s.clock.settle();

    // Assert
    expect(s.events).toContainEqual(expect.objectContaining({ type: "restored", tryNowCount: 1 }));
  });

  it("ignores Try now while Saleor answers", async () => {
    // Arrange
    const s = setup();

    // Act
    s.monitor.checkNow();
    await s.clock.settle();

    // Assert
    expect(s.check).not.toHaveBeenCalled();
  });

  it("says offline once the browser has reported it for two seconds", async () => {
    // Arrange
    const s = setup();

    s.browser.online = false;

    // Act
    s.monitor.browserWentOffline();
    await s.clock.advance(1_999);

    const duringGrace = statusOf(s);

    await s.clock.advance(1);

    // Assert
    expect(duringGrace).toBe("online");
    expect(statusOf(s)).toBe("offline");
    expect(s.events).toEqual([{ type: "lost", outageId: 1, cause: "offline", httpStatus: 0 }]);
  });

  it("shows nothing when the browser is back online within two seconds", async () => {
    // Arrange
    const s = setup();

    s.browser.online = false;
    s.monitor.browserWentOffline();
    await s.clock.advance(1_000);

    // Act
    s.browser.online = true;
    s.monitor.browserCameOnline();
    await s.clock.advance(5_000);

    // Assert
    expect(statusOf(s)).toBe("online");
    expect(s.events).toEqual([]);
  });

  it("checks right away when the browser comes back online", async () => {
    // Arrange
    const s = setup();

    s.browser.online = false;
    s.monitor.browserWentOffline();
    await s.clock.advance(2_500);
    s.check.mockResolvedValueOnce(answered);

    // Act
    s.browser.online = true;
    s.monitor.browserCameOnline();
    await s.clock.settle();

    // Assert
    // The next scheduled check was due at 4 s; this one ran at 2.5 s.
    expect(s.check).toHaveBeenCalledTimes(1);
    expect(statusOf(s)).toBe("restored");
  });

  it("waits for a hidden tab to become visible before checking", async () => {
    // Arrange
    const s = setup();

    s.browser.visible = false;
    s.monitor.reportFailure(noResponse);
    await s.clock.advance(10_000);

    const checksWhileHidden = s.check.mock.calls.length;

    // Act
    s.browser.visible = true;
    s.monitor.pageBecameVisible();
    await s.clock.settle();

    // Assert
    expect(checksWhileHidden).toBe(0);
    expect(s.checkTimes).toEqual([10_000]);
    expect(statusOf(s)).toBe("unreachable");
  });

  it("keeps the outage over when a request gets an answer while a check is still running", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1_000);

    let release: (result: ConnectionCheckResult) => void = () => undefined;

    s.check.mockImplementationOnce(() => new Promise(resolve => (release = resolve)));
    s.monitor.checkNow();

    // Act
    s.monitor.reportSuccess();
    release(unanswered);
    await s.clock.settle();

    // Assert
    expect(statusOf(s)).toBe("restored");
  });

  it("lets Try now join a check that is already running, and shows it as checking", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1_000);

    let release: (result: ConnectionCheckResult) => void = () => undefined;

    s.check.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          s.checkTimes.push(s.clock.now());
          release = resolve;
        }),
    );
    await s.clock.advance(2_000);

    // Act
    s.monitor.checkNow();

    const whileJoined = s.monitor.stateVar().checkingNow;

    release(unanswered);
    await s.clock.settle();
    await s.clock.advance(2_000);

    // Assert
    expect(whileJoined).toBe(true);
    expect(s.monitor.stateVar().checkingNow).toBe(false);
    // One check for both, then the schedule starts again at 2 s.
    expect(s.checkTimes).toEqual([1_000, 3_000, 5_000]);
    s.monitor.reportSuccess();
    expect(s.events).toContainEqual(expect.objectContaining({ type: "restored", tryNowCount: 1 }));
  });

  it("keeps working when a listener throws, and reports the error", async () => {
    // Arrange
    const s = setup();
    const broken = new Error("listener failed");

    s.monitor.subscribe(() => {
      throw broken;
    });
    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1_000);

    // Act
    const report = (): void => s.monitor.reportSuccess();

    // Assert
    expect(report).not.toThrow();
    expect(statusOf(s)).toBe("restored");
    expect(s.events.map(event => event.type)).toEqual(["lost", "restored", "recovered"]);
    expect(s.reportError).toHaveBeenCalledWith(broken);
  });

  it("reports how an outage ended when it changed from unreachable to offline", async () => {
    // Arrange
    const s = setup();

    s.monitor.reportFailure(noResponse);
    await s.clock.advance(1_000);
    s.browser.online = false;
    s.monitor.browserWentOffline();

    // Act
    s.monitor.reportSuccess();

    // Assert
    expect(s.events).toContainEqual(
      expect.objectContaining({ type: "lost", cause: "unreachable" }),
    );
    expect(s.events).toContainEqual(
      expect.objectContaining({ type: "restored", cause: "offline" }),
    );
  });

  it("numbers each outage, so a lost and a restored event can be paired", async () => {
    // Arrange
    const s = setup();

    // Act
    for (let i = 0; i < 2; i++) {
      s.monitor.reportFailure(noResponse);
      await s.clock.advance(1_000);
      s.monitor.reportSuccess();
      await s.clock.advance(3_000);
    }

    // Assert
    expect(
      s.events
        .filter(event => event.type !== "recovered")
        .map(event => [event.type, event.outageId]),
    ).toEqual([
      ["lost", 1],
      ["restored", 1],
      ["lost", 2],
      ["restored", 2],
    ]);
  });

  it("knows whether a banner is on screen to explain outages", () => {
    // Arrange
    const s = setup();

    // Act
    const detach = s.monitor.attachBanner();
    const whileAttached = s.monitor.isBannerAttached();

    detach();

    // Assert
    expect(whileAttached).toBe(true);
    expect(s.monitor.isBannerAttached()).toBe(false);
  });
});
