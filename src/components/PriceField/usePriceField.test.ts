import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { usePriceField } from "./usePriceField";

describe("usePriceField", () => {
  const createEvent = (value: string, name = "price") => ({
    target: { name, value },
  });

  describe("keystroke rejection guard", () => {
    it("fires onChange for valid formatted input", () => {
      // Arrange
      const onChange = jest.fn();
      const { result } = renderHook(() => usePriceField("USD", onChange));

      // Act
      act(() => {
        result.current.onChange(createEvent("12.34"));
      });

      // Assert
      expect(onChange).toHaveBeenCalledWith({
        target: { name: "price", value: "12.34" },
      });
    });

    it("fires onChange with null when input is cleared", () => {
      // Arrange
      const onChange = jest.fn();
      const { result } = renderHook(() => usePriceField("USD", onChange));

      // Act
      act(() => {
        result.current.onChange(createEvent(""));
      });

      // Assert
      expect(onChange).toHaveBeenCalledWith({
        target: { name: "price", value: null },
      });
    });

    it("does not fire onChange when bad keystroke would clear non-empty input", () => {
      // Arrange
      const onChange = jest.fn();
      const { result } = renderHook(() => usePriceField("USD", onChange));

      // Act — simulates "12.3" + accidental "," → "12.3," which formatPriceInput rejects
      act(() => {
        result.current.onChange(createEvent("12.3,"));
      });

      // Assert
      expect(onChange).not.toHaveBeenCalled();
    });

    it("does not fire onChange for garbage paste over existing value", () => {
      // Arrange
      const onChange = jest.fn();
      const { result } = renderHook(() => usePriceField("USD", onChange));

      // Act
      act(() => {
        result.current.onChange(createEvent("abc!@#"));
      });

      // Assert
      expect(onChange).not.toHaveBeenCalled();
    });

    it("fires onChange for valid pasted international format", () => {
      // Arrange
      const onChange = jest.fn();
      const { result } = renderHook(() => usePriceField("USD", onChange));

      // Act
      act(() => {
        result.current.onChange(createEvent("1.234,56"));
      });

      // Assert
      expect(onChange).toHaveBeenCalledWith({
        target: { name: "price", value: "1234.56" },
      });
    });
  });
});
