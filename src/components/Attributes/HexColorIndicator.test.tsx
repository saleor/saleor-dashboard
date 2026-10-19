import { act, fireEvent, render, screen } from "@testing-library/react";

import { getHexColor } from "./getHexColor";
import { HexColorIndicator } from "./HexColorIndicator";

describe("getHexColor", () => {
  it.each(["#111", "#fafa", "#FAFAFA", "#2563eb80"])("should accept %s", value => {
    // Arrange / Act / Assert
    expect(getHexColor(value)).toBe(value);
  });

  it("should trim surrounding whitespace", () => {
    // Arrange / Act / Assert
    expect(getHexColor("  #fafafa ")).toBe("#fafafa");
  });

  it.each(["", "fafafa", "#ff", "#fffff", "#ggg", "#fafafa text", "red", null, undefined])(
    "should reject %s",
    value => {
      // Arrange / Act / Assert
      expect(getHexColor(value)).toBeNull();
    },
  );
});

describe("HexColorIndicator", () => {
  it("should render a swatch with the detected color", () => {
    // Arrange / Act
    render(<HexColorIndicator value="#fafafa" />);

    // Assert
    expect(screen.getByTestId("hex-color-indicator").style.getPropertyValue("--hex-color")).toBe(
      "#fafafa",
    );
  });

  it("should render nothing for non-color text", () => {
    // Arrange / Act
    const { container } = render(<HexColorIndicator value="Cotton" />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  describe("hiding", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const getIndicatorColor = (): string =>
      screen.getByTestId("hex-color-indicator").style.getPropertyValue("--hex-color");

    it("should keep the indicator while the value is briefly invalid", () => {
      // Arrange
      const { rerender } = render(<HexColorIndicator value="#FFF" />);

      // Act
      rerender(<HexColorIndicator value="#FF" />);
      act(() => {
        jest.advanceTimersByTime(499);
      });
      rerender(<HexColorIndicator value="#FF0" />);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Assert
      expect(getIndicatorColor()).toBe("#FF0");
    });

    it("should show the last valid color until the hide delay passes", () => {
      // Arrange
      const { rerender } = render(<HexColorIndicator value="#FFF" />);

      // Act
      rerender(<HexColorIndicator value="#FF" />);

      // Assert
      expect(getIndicatorColor()).toBe("#FFF");
    });

    it("should remove the indicator after the delay and the exit animation", () => {
      // Arrange
      const { rerender, container } = render(<HexColorIndicator value="#FFF" />);

      // Act
      rerender(<HexColorIndicator value="#FF" />);
      act(() => {
        jest.advanceTimersByTime(500);
      });
      fireEvent.animationEnd(screen.getByTestId("hex-color-indicator"));

      // Assert
      expect(container).toBeEmptyDOMElement();
    });

    it("should bring the indicator back when a color is typed during the exit animation", () => {
      // Arrange
      const { rerender } = render(<HexColorIndicator value="#FFF" />);

      rerender(<HexColorIndicator value="#FF" />);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Act
      rerender(<HexColorIndicator value="#FF0" />);
      fireEvent.animationEnd(screen.getByTestId("hex-color-indicator"));

      // Assert
      expect(getIndicatorColor()).toBe("#FF0");
    });
  });
});
