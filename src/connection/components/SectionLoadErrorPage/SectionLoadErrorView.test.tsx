import Wrapper from "@test/wrapper";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { createMemoryHistory, type MemoryHistory } from "history";
import { Router } from "react-router-dom";

import {
  type ConnectionCheckResult,
  type ConnectionMonitor,
  createConnectionMonitor,
} from "../../connectionMonitor";
import { createTestClock } from "../../createTestClock";
import { SectionLoadErrorView } from "./SectionLoadErrorView";

interface Setup {
  monitor: ConnectionMonitor;
  clock: ReturnType<typeof createTestClock>;
  check: jest.Mock<Promise<ConnectionCheckResult>, []>;
  history: MemoryHistory;
  onLeave: jest.Mock<void, []>;
  reload: jest.Mock<void, []>;
}

const answered: ConnectionCheckResult = { ok: true };
const unanswered: ConnectionCheckResult = {
  ok: false,
  failure: { httpStatus: 503, retryAfterMs: null },
};

const renderView = (): Setup => {
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
  const history = createMemoryHistory({ initialEntries: ["/customers/"] });
  const onLeave = jest.fn<void, []>();
  const reload = jest.fn<void, []>();

  render(
    <Router history={history}>
      <SectionLoadErrorView monitor={monitor} onLeave={onLeave} reload={reload} />
    </Router>,
    { wrapper: Wrapper },
  );

  return { monitor, clock, check, history, onLeave, reload };
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

describe("SectionLoadErrorView", () => {
  it("offers a reload while the connection works", () => {
    // Arrange
    const s = renderView();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Reload page" }));

    // Assert
    expect(screen.getByText("Reload the page to try again.")).toBeInTheDocument();
    expect(s.reload).toHaveBeenCalledTimes(1);
  });

  it("waits without a reload button while the connection is lost", async () => {
    // Arrange
    const s = renderView();

    // Act
    await failOnce(s, unanswered);

    // Assert
    expect(screen.getByText("It will open once the connection is back.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("waits as soon as the browser goes offline, and offers a reload once it's back", () => {
    // Arrange
    const onLine = jest.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    renderView();

    const whileOffline = screen.queryByRole("button", { name: "Reload page" });

    // Act
    onLine.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    // Assert
    expect(whileOffline).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
    onLine.mockRestore();
  });

  it("reloads by itself once an outage ends", async () => {
    // Arrange
    const s = renderView();

    await failOnce(s, unanswered);

    // Act
    act(() => s.monitor.reportSuccess());

    // Assert
    expect(s.reload).toHaveBeenCalledTimes(1);
  });

  it("doesn't reload after a failed request that wasn't an outage", async () => {
    // Arrange
    const s = renderView();

    // Act
    await failOnce(s, answered);

    // Assert
    expect(s.reload).not.toHaveBeenCalled();
  });

  it("shows the next page once the merchant opens another one", () => {
    // Arrange
    const s = renderView();

    act(() => s.history.push("/customers/?query=anna"));

    const afterSamePage = s.onLeave.mock.calls.length;

    // Act
    act(() => s.history.push("/orders/"));

    // Assert
    expect(afterSamePage).toBe(0);
    expect(s.onLeave).toHaveBeenCalledTimes(1);
  });
});
