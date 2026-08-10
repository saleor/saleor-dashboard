import { act, renderHook } from "@testing-library/react";
import { type ChangeEvent, type FocusEvent } from "react";

import { usePriceFieldV2 } from "./usePriceFieldV2";

describe("usePriceFieldV2", () => {
  const createInputTarget = (value: string): HTMLInputElement => {
    const target = document.createElement("input");

    target.value = value;

    return target;
  };

  // The handlers only read `target.value`, so a bare target stands in for the full event.
  const createChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
    ({ target: createInputTarget(value) }) as ChangeEvent<HTMLInputElement>;

  const createBlurEvent = (value: string): FocusEvent<HTMLInputElement> =>
    ({ target: createInputTarget(value) }) as FocusEvent<HTMLInputElement>;

  it("fires onChange for valid formatted input", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleChange(createChangeEvent("12.34"));
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith("12.34");
  });

  it("fires onChange with empty string when input is cleared", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleChange(createChangeEvent(""));
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("does not fire onChange when bad keystroke would clear non-empty input", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleChange(createChangeEvent("12.3,"));
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not fire onChange for garbage paste over existing value", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleChange(createChangeEvent("abc!@#"));
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("fires onChange for valid pasted international format", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleChange(createChangeEvent("1.234,56"));
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith("1234.56");
  });

  it("pads to currency decimals on blur", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleBlur(createBlurEvent("10.2"));
    });

    // Assert
    expect(onChange).toHaveBeenCalledWith("10.20");
  });

  it("does not pad on blur when value is already canonical", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleBlur(createBlurEvent("10.20"));
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not pad empty values on blur", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() => usePriceFieldV2("USD", onChange));

    // Act
    act(() => {
      result.current.handleBlur(createBlurEvent(""));
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it("skips blur padding when padDecimalsOnBlur is false", () => {
    // Arrange
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      usePriceFieldV2("USD", onChange, { padDecimalsOnBlur: false }),
    );

    // Act
    act(() => {
      result.current.handleBlur(createBlurEvent("10.2"));
    });

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });
});
