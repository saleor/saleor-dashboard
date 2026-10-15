import { act, renderHook } from "@testing-library/react";

import { createBulkSubmitResult } from "../bulkSubmitResult";
import { useTranslationSaveFeedback } from "./useTranslationSaveFeedback";

const mockNotify = jest.fn();

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): typeof mockNotify => mockNotify,
}));

describe("useTranslationSaveFeedback", () => {
  beforeEach(() => jest.clearAllMocks());

  it("refetches and reports a successful field save", () => {
    // Arrange
    const refetch = jest.fn();
    const { result } = renderHook(() => useTranslationSaveFeedback({ refetch }));

    // Act
    act(() => {
      expect(result.current.completeSingleFieldSave([])).toEqual([]);
    });

    // Assert
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
  });

  it("preserves field errors without reporting success", () => {
    // Arrange
    const refetch = jest.fn();
    const errors = [{ field: "fullDescription", message: "Invalid description" }];
    const { result } = renderHook(() => useTranslationSaveFeedback({ refetch }));

    // Act
    const returnedErrors = result.current.completeSingleFieldSave(errors);

    // Assert
    expect(returnedErrors).toBe(errors);
    expect(refetch).not.toHaveBeenCalled();
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("clears previous field errors and reports a successful bulk retry", () => {
    // Arrange
    const refetch = jest.fn();
    const { result } = renderHook(() => useTranslationSaveFeedback({ refetch }));

    act(() => {
      result.current.completeBulkSave(
        createBulkSubmitResult([{ fieldName: "fullDescription", message: "Invalid description" }]),
      );
    });
    mockNotify.mockClear();

    // Act
    act(() => {
      result.current.completeBulkSave(createBulkSubmitResult([]));
    });

    // Assert
    expect(result.current.fieldErrors).toEqual({});
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "success" }));
  });

  it("reports partial bulk failures without reporting success", () => {
    // Arrange
    const refetch = jest.fn();
    const { result } = renderHook(() => useTranslationSaveFeedback({ refetch }));

    // Act
    act(() => {
      result.current.completeBulkSave(
        createBulkSubmitResult([{ fieldName: "fullDescription", message: "Invalid description" }]),
      );
    });

    // Assert
    expect(result.current.fieldErrors).toEqual({ fullDescription: "Invalid description" });
    expect(refetch).not.toHaveBeenCalled();
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "error" }));
  });
});
