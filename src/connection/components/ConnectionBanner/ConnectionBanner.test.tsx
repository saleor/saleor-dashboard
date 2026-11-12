import Wrapper from "@test/wrapper";
import { act, fireEvent, render, type RenderResult, screen } from "@testing-library/react";

import { type ConnectionStatus } from "../../connectionMonitor";
import { ConnectionBanner } from "./ConnectionBanner";

const renderBanner = (
  status: ConnectionStatus,
  { checkingNow = false, onTryNow = jest.fn() } = {},
): RenderResult =>
  render(<ConnectionBanner status={status} checkingNow={checkingNow} onTryNow={onTryNow} />, {
    wrapper: Wrapper,
  });

describe("ConnectionBanner", () => {
  it.each<ConnectionStatus>(["online", "suspect"])(
    "says nothing while %s, but keeps its live regions ready",
    status => {
      // Arrange & Act
      renderBanner(status);

      // Assert
      expect(screen.getByTestId("connection-banner")).toHaveAttribute("data-test-state", "hidden");
      expect(screen.getByRole("alert")).toBeEmptyDOMElement();
      expect(screen.getByRole("status")).toBeEmptyDOMElement();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    },
  );

  it("announces that Saleor can't be reached and offers Try now", () => {
    // Arrange
    const onTryNow = jest.fn();

    renderBanner("unreachable", { onTryNow });

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Try now" }));

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Can't reach Saleor. You're still signed in, and unsaved changes stay on this page. Trying to reconnect…",
    );
    expect(onTryNow).toHaveBeenCalledTimes(1);
  });

  it("can't be pressed again while its check runs", () => {
    // Arrange
    const onTryNow = jest.fn();

    renderBanner("unreachable", { checkingNow: true, onTryNow });

    // Act
    fireEvent.click(screen.getByTestId("connection-banner-try-now"));

    // Assert
    expect(screen.getByTestId("connection-banner-try-now")).toHaveAttribute("aria-busy", "true");
    expect(onTryNow).not.toHaveBeenCalled();
  });

  it("says the browser is offline without a button, since coming back online retries", () => {
    // Arrange & Act
    renderBanner("offline");

    // Assert
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You're offline. You're still signed in, and unsaved changes stay on this page. We'll reconnect when you're back online.",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("confirms the connection politely, not as an alert", () => {
    // Arrange
    const { rerender } = renderBanner("unreachable");

    // Act
    rerender(<ConnectionBanner status="restored" checkingNow={false} onTryNow={jest.fn()} />);

    // Assert
    expect(screen.getByRole("status")).toHaveTextContent("Connected again.");
    expect(screen.getByRole("alert")).toBeEmptyDOMElement();
  });

  it("keeps its last words while it closes", () => {
    // Arrange
    const { rerender } = renderBanner("restored");

    // Act
    rerender(<ConnectionBanner status="online" checkingNow={false} onTryNow={jest.fn()} />);

    // Assert
    expect(screen.getByTestId("connection-banner")).toHaveAttribute("data-test-state", "hidden");
    expect(screen.getByTestId("connection-banner")).toHaveTextContent("Connected again.");
  });

  it("forgets its text once closed, so it can't be read or found while hidden", () => {
    // Arrange
    jest.useFakeTimers();

    const { rerender } = renderBanner("restored");

    rerender(<ConnectionBanner status="online" checkingNow={false} onTryNow={jest.fn()} />);

    // Act
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Assert
    expect(screen.getByTestId("connection-banner").textContent).toBe("");
    jest.useRealTimers();
  });

  it("keeps keyboard focus at the banner when Try now goes away under it", () => {
    // Arrange
    const { rerender } = renderBanner("unreachable");

    screen.getByRole("button", { name: "Try now" }).focus();

    // Act
    rerender(<ConnectionBanner status="restored" checkingNow={false} onTryNow={jest.fn()} />);

    // Assert
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByTestId("connection-banner")).toHaveFocus();
  });

  it("leaves focus alone when Try now goes away without it", () => {
    // Arrange
    const outside = document.createElement("input");

    document.body.appendChild(outside);

    const { rerender } = renderBanner("unreachable");

    outside.focus();

    // Act
    rerender(<ConnectionBanner status="restored" checkingNow={false} onTryNow={jest.fn()} />);

    // Assert
    expect(outside).toHaveFocus();
    outside.remove();
  });
});
