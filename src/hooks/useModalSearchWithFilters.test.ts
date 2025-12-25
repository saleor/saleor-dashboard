import { act, renderHook } from "@testing-library/react-hooks";
import { ChangeEvent } from "react";

import {
  useModalSearchWithFilters,
  UseModalSearchWithFiltersOptions,
} from "./useModalSearchWithFilters";

const DEBOUNCE_MS = 200;

interface TestFilters {
  category?: { oneOf: string[] };
  productType?: { oneOf: string[] };
}

describe("useModalSearchWithFilters", () => {
  let mockOnFetch: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnFetch = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const createChangeEvent = (value: string): ChangeEvent<HTMLInputElement> =>
    ({
      target: { value },
    }) as ChangeEvent<HTMLInputElement>;

  const defaultOptions: UseModalSearchWithFiltersOptions<TestFilters> = {
    filterVariables: {},
    open: true,
    onFetch: undefined,
    debounceMs: DEBOUNCE_MS,
  };

  describe("when dialog opens", () => {
    it("should trigger immediate search with filter variables", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: { productType: { oneOf: ["pt-1"] } },
        open: true,
        onFetch: mockOnFetch,
      };

      // Act
      renderHook(() => useModalSearchWithFilters(options));

      // Assert
      expect(mockOnFetch).toHaveBeenCalledWith({ productType: { oneOf: ["pt-1"] } }, "");
    });

    it("should not trigger search when dialog is closed", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: false,
        onFetch: mockOnFetch,
      };

      // Act
      renderHook(() => useModalSearchWithFilters(options));

      // Assert
      expect(mockOnFetch).not.toHaveBeenCalled();
    });
  });

  describe("when query changes", () => {
    it("should debounce search when query changes", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Clear initial call from open
      mockOnFetch.mockClear();

      // Act - change query using the handler
      act(() => {
        result.current.onQueryChange(createChangeEvent("a"));
      });

      // Assert - should not be called immediately
      expect(mockOnFetch).not.toHaveBeenCalled();

      // Act - advance timer by debounce time
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      // Assert - should be called after debounce
      expect(mockOnFetch).toHaveBeenCalledTimes(1);
      expect(mockOnFetch).toHaveBeenCalledWith({}, "a");
    });

    it("should cancel previous debounce when query changes rapidly", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - type rapidly: a -> ab -> abc
      act(() => {
        result.current.onQueryChange(createChangeEvent("a"));
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.onQueryChange(createChangeEvent("ab"));
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.onQueryChange(createChangeEvent("abc"));
      });

      // Assert - should not have been called yet
      expect(mockOnFetch).not.toHaveBeenCalled();

      // Act - advance past debounce time
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      // Assert - should only be called once with final query
      expect(mockOnFetch).toHaveBeenCalledTimes(1);
      expect(mockOnFetch).toHaveBeenCalledWith({}, "abc");
    });

    it("should include current filter variables when query changes", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: { productType: { oneOf: ["pt-1"] } },
        open: true,
        onFetch: mockOnFetch,
      };
      const { result, rerender } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - change query while filters are active
      act(() => {
        result.current.onQueryChange(createChangeEvent("search term"));
      });

      // Rerender to ensure filterVariables are still available
      rerender(options);

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      // Assert - should include both filters and query
      expect(mockOnFetch).toHaveBeenCalledWith({ productType: { oneOf: ["pt-1"] } }, "search term");
    });
  });

  describe("when filter variables change", () => {
    it("should trigger immediate search when filter variables change", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: {},
        open: true,
        onFetch: mockOnFetch,
      };
      const { rerender } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - change filter variables
      rerender({ ...options, filterVariables: { category: { oneOf: ["cat-1"] } } });

      // Assert - should be called immediately (no debounce)
      expect(mockOnFetch).toHaveBeenCalledTimes(1);
      expect(mockOnFetch).toHaveBeenCalledWith({ category: { oneOf: ["cat-1"] } }, "");
    });

    it("should include current query when filters change", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: {},
        initialQuery: "existing query",
        open: true,
        onFetch: mockOnFetch,
      };
      const { rerender } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - change filter variables
      rerender({ ...options, filterVariables: { productType: { oneOf: ["pt-2"] } } });

      // Assert - should include existing query
      expect(mockOnFetch).toHaveBeenCalledWith(
        { productType: { oneOf: ["pt-2"] } },
        "existing query",
      );
    });
  });

  describe("ref pattern for debounced function", () => {
    it("should use latest values when debounced function executes", () => {
      // Arrange - this tests that the ref pattern works correctly
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: { productType: { oneOf: ["pt-1"] } },
        open: true,
        onFetch: mockOnFetch,
      };
      const { result, rerender } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - start typing (triggers debounce)
      act(() => {
        result.current.onQueryChange(createChangeEvent("a"));
      });

      // Before debounce completes, change filter variables
      rerender({
        ...options,
        filterVariables: { productType: { oneOf: ["pt-2"] } },
      });

      // Clear the immediate call from filter change
      mockOnFetch.mockClear();

      // Let debounce complete
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      // Assert - debounced call should use latest filter variables from ref
      expect(mockOnFetch).toHaveBeenCalledWith({ productType: { oneOf: ["pt-2"] } }, "a");
    });
  });

  describe("when onFetch is undefined", () => {
    it("should not throw when query changes", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: undefined,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Act & Assert - should not throw
      expect(() => {
        act(() => {
          result.current.onQueryChange(createChangeEvent("a"));
        });

        act(() => {
          jest.advanceTimersByTime(DEBOUNCE_MS);
        });
      }).not.toThrow();
    });

    it("should not throw when filter variables change", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        filterVariables: {},
        open: true,
        onFetch: undefined,
      };
      const { rerender } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Act & Assert - should not throw
      expect(() => {
        rerender({ ...options, filterVariables: { category: { oneOf: ["cat-1"] } } });
      }).not.toThrow();
    });
  });

  describe("cleanup", () => {
    it("should clear debounce timer on unmount", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
      };
      const { result, unmount } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - start typing
      act(() => {
        result.current.onQueryChange(createChangeEvent("a"));
      });

      // Unmount before debounce completes
      unmount();

      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      // Assert - callback should not be called after unmount
      expect(mockOnFetch).not.toHaveBeenCalled();
    });
  });

  describe("custom debounce time", () => {
    it("should respect custom debounce time", () => {
      // Arrange
      const customDebounceMs = 500;
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
        debounceMs: customDebounceMs,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      mockOnFetch.mockClear();

      // Act - change query
      act(() => {
        result.current.onQueryChange(createChangeEvent("a"));
      });

      // Assert - should not be called after default debounce time
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_MS);
      });

      expect(mockOnFetch).not.toHaveBeenCalled();

      // Assert - should be called after custom debounce time
      act(() => {
        jest.advanceTimersByTime(customDebounceMs - DEBOUNCE_MS);
      });

      expect(mockOnFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetQuery", () => {
    it("should reset query to initial value", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Act - change query then reset
      act(() => {
        result.current.onQueryChange(createChangeEvent("test query"));
      });

      expect(result.current.query).toBe("test query");

      act(() => {
        result.current.resetQuery();
      });

      // Assert
      expect(result.current.query).toBe("");
    });

    it("should reset query to custom initial value", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
        initialQuery: "initial",
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Act - change query then reset
      act(() => {
        result.current.onQueryChange(createChangeEvent("changed"));
      });

      expect(result.current.query).toBe("changed");

      act(() => {
        result.current.resetQuery();
      });

      // Assert
      expect(result.current.query).toBe("initial");
    });
  });

  describe("query state", () => {
    it("should expose current query value", () => {
      // Arrange
      const options: UseModalSearchWithFiltersOptions<TestFilters> = {
        ...defaultOptions,
        open: true,
        onFetch: mockOnFetch,
      };
      const { result } = renderHook(props => useModalSearchWithFilters(props), {
        initialProps: options,
      });

      // Assert - initial value
      expect(result.current.query).toBe("");

      // Act - change query
      act(() => {
        result.current.onQueryChange(createChangeEvent("new value"));
      });

      // Assert - updated value
      expect(result.current.query).toBe("new value");
    });
  });
});
