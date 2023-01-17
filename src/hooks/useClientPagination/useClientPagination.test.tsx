import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useClientPagination } from "./useClientPagination";

describe("useClientPagination", () => {
  test("should reset current page when row number change", () => {
    // Arrange
    const { result } = renderHook(() => useClientPagination());

    // Act
    act(() => result.current.changeCurrentPage(2));
    act(() => result.current.changeRowNumber(20));

    // Assert
    expect(result.current.currentPage).toEqual(1);
    expect(result.current.rowNumber).toEqual(20);
  });

  test("should reset current page and row number when call restartPagination", () => {
    // Arrange
    const { result } = renderHook(() => useClientPagination());

    // Act
    act(() => result.current.changeCurrentPage(2));
    act(() => result.current.changeRowNumber(20));
    act(() => result.current.restartPagination());

    // Assert
    expect(result.current.currentPage).toEqual(1);
    expect(result.current.rowNumber).toEqual(10);
  });

  test("should change current page when call changeCurrentPage", () => {
    // Arrange
    const { result } = renderHook(() => useClientPagination());

    // Act
    act(() => result.current.changeCurrentPage(2));

    // Assert
    expect(result.current.currentPage).toEqual(2);
  });

  test("should change row number when call changeRowNumber", () => {
    // Arrange
    const { result } = renderHook(() => useClientPagination());

    // Act
    act(() => result.current.changeRowNumber(20));

    // Assert
    expect(result.current.rowNumber).toEqual(20);
  });
});
