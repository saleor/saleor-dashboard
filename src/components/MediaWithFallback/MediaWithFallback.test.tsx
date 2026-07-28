import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { MediaWithFallback } from "./MediaWithFallback";

const SRC = "https://example.com/image.jpg";
const PLACEHOLDER_SRC = "blob:placeholder";
// Backoff schedule from useImageLoadRetry: capped at 30s per delay, ~2min total.
const RETRY_DELAYS_MS = [2_000, 4_000, 8_000, 16_000, 30_000, 30_000, 30_000];

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en" messages={{}}>
    <ThemeProvider>{children}</ThemeProvider>
  </IntlProvider>
);

const getMainImg = (container: HTMLElement): HTMLImageElement => {
  const img = container.querySelector<HTMLImageElement>(`img[src="${SRC}"]`);

  if (!img) {
    throw new Error("Main image not found");
  }

  return img;
};

describe("MediaWithFallback", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("keeps the loading state and retries after a load error instead of failing immediately", () => {
    // Arrange
    const { container } = render(<MediaWithFallback src={SRC} alt="Product" />, {
      wrapper: Wrapper,
    });
    const firstImg = getMainImg(container);

    // Act
    fireEvent.error(firstImg);

    // Assert - still loading (skeleton visible, no error fallback), retry pending
    expect(screen.queryByText("Image could not be loaded")).not.toBeInTheDocument();

    // Act - just before the first backoff delay elapses nothing happens
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0] - 1));

    // Assert
    expect(getMainImg(container)).toBe(firstImg);

    // Act - delay elapses, image element is remounted to re-request the URL
    act(() => jest.advanceTimersByTime(1));

    // Assert
    expect(getMainImg(container)).not.toBe(firstImg);
  });

  it("shows the image when a retry succeeds", () => {
    // Arrange
    const onPlaceholderUnused = jest.fn();
    const { container } = render(
      <MediaWithFallback src={SRC} alt="Product" onPlaceholderUnused={onPlaceholderUnused} />,
      { wrapper: Wrapper },
    );

    // Act - first attempt fails, second succeeds
    fireEvent.error(getMainImg(container));
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    fireEvent.load(getMainImg(container));

    // Assert
    expect(getMainImg(container).style.display).not.toBe("none");
    expect(onPlaceholderUnused).toHaveBeenCalledTimes(1);
  });

  it("keeps the placeholder visible during retries and does not release it on intermediate errors", () => {
    // Arrange
    const onPlaceholderUnused = jest.fn();
    const { container } = render(
      <MediaWithFallback
        src={SRC}
        alt="Product"
        placeholderSrc={PLACEHOLDER_SRC}
        onPlaceholderUnused={onPlaceholderUnused}
      />,
      { wrapper: Wrapper },
    );

    // Act
    fireEvent.error(getMainImg(container));
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    fireEvent.error(getMainImg(container));

    // Assert
    expect(screen.getByTestId("media-placeholder")).toBeInTheDocument();
    expect(onPlaceholderUnused).not.toHaveBeenCalled();
  });

  it("shows the error fallback and releases the placeholder once the retry budget is exhausted", () => {
    // Arrange
    const onPlaceholderUnused = jest.fn();
    const { container } = render(
      <MediaWithFallback src={SRC} alt="Product" onPlaceholderUnused={onPlaceholderUnused} />,
      { wrapper: Wrapper },
    );

    // Act - fail every attempt through the whole backoff schedule
    RETRY_DELAYS_MS.forEach(delay => {
      fireEvent.error(getMainImg(container));
      act(() => jest.advanceTimersByTime(delay));
    });

    // Assert - budget not yet exhausted, still loading
    expect(screen.queryByText("Image could not be loaded")).not.toBeInTheDocument();

    // Act - one more failure exceeds the total budget
    fireEvent.error(getMainImg(container));

    // Assert
    expect(screen.getByText("Image could not be loaded")).toBeInTheDocument();
    expect(onPlaceholderUnused).toHaveBeenCalledTimes(1);
  });

  it("cancels the pending retry on unmount", () => {
    // Arrange
    const { container, unmount } = render(<MediaWithFallback src={SRC} alt="Product" />, {
      wrapper: Wrapper,
    });

    // Act
    fireEvent.error(getMainImg(container));
    unmount();

    // Assert
    expect(jest.getTimerCount()).toBe(0);
  });

  it("resets the backoff schedule when src changes", () => {
    // Arrange
    const { container, rerender } = render(
      <Wrapper>
        <MediaWithFallback src="https://example.com/old.jpg" alt="Product" />
      </Wrapper>,
    );
    const oldImg = container.querySelector<HTMLImageElement>(
      'img[src="https://example.com/old.jpg"]',
    );

    if (!oldImg) {
      throw new Error("Old image not found");
    }

    // Act - burn the first delay on the old src, then swap the src
    fireEvent.error(oldImg);
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0]));
    rerender(
      <Wrapper>
        <MediaWithFallback src={SRC} alt="Product" />
      </Wrapper>,
    );

    // Act - fail the new src; its first retry should use the initial delay again
    const firstImg = getMainImg(container);

    fireEvent.error(firstImg);
    act(() => jest.advanceTimersByTime(RETRY_DELAYS_MS[0] - 1));

    // Assert - not remounted yet
    expect(getMainImg(container)).toBe(firstImg);

    // Act
    act(() => jest.advanceTimersByTime(1));

    // Assert - remounted after the initial delay, proving the schedule was reset
    expect(getMainImg(container)).not.toBe(firstImg);
  });
});
