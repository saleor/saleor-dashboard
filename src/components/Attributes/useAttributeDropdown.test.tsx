import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { act, renderHook } from "@testing-library/react-hooks";

import { useAttributeDropdown } from "./useAttributeDropdown";

jest.mock("react-intl", () => {
  const actual = jest.requireActual("react-intl");

  return {
    ...actual,
    useIntl: () => ({
      formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
    }),
    defineMessages: (messages: unknown): unknown => messages,
  };
});

describe("useAttributeDropdown", () => {
  const mockFetchOptions = jest.fn();
  const mockFetchMore = {
    hasMore: true,
    loading: false,
    onFetchMore: jest.fn(),
    totalCount: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // We add a line "Add new value" for better UX
  // it just sets the input value to whatever user typed, attribute created on page save
  describe("customValueOption", () => {
    it("should not show 'Add new value' option when user hasn't typed anything", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Assert
      expect(result.current.customValueOption).toEqual([]);
    });

    it("should show 'Add new value' option when user types a value not in the dropdown", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "orange",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Assert
      expect(result.current.customValueOption).toHaveLength(1);
      expect(result.current.customValueOption[0].value).toBe("orange");
      expect(result.current.customValueOption[0].label).toContain("Add new value");
    });

    it("should hide 'Add new value' option when user types the already selected value", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "Orange",
          selectedValue: { label: "orange", value: "orange" },
          fetchOptions: mockFetchOptions,
        }),
      );

      // Assert
      expect(result.current.customValueOption).toEqual([]);
    });

    it("should show 'Add new value' option when user changes from selected value to a different value", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "purple",
          selectedValue: { label: "orange", value: "orange" },
          fetchOptions: mockFetchOptions,
        }),
      );

      // Assert
      expect(result.current.customValueOption).toHaveLength(1);
      expect(result.current.customValueOption[0].value).toBe("purple");
    });
  });

  describe("customValueLabel", () => {
    it("should format message with 'Add new value' text", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "emerald",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Assert
      expect(result.current.customValueLabel).toMatch(/Add new value/i);
    });
  });

  describe("handleFetchMore", () => {
    it("should call onFetchMore when hasMore is true", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
          fetchMore: mockFetchMore,
        }),
      );

      // Act
      result.current.handleFetchMore();

      // Assert
      expect(mockFetchMore.onFetchMore).toHaveBeenCalledTimes(1);
    });

    it("should not call onFetchMore when hasMore is false", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
          fetchMore: { ...mockFetchMore, hasMore: false },
        }),
      );

      // Act
      result.current.handleFetchMore();

      // Assert
      expect(mockFetchMore.onFetchMore).not.toHaveBeenCalled();
    });

    it("should not call onFetchMore when fetchMore is not provided", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Act
      result.current.handleFetchMore();

      // Assert
      expect(mockFetchMore.onFetchMore).not.toHaveBeenCalled();
    });
  });

  describe("handleInputChange", () => {
    it("should debounce fetch calls", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Act - call multiple times rapidly
      act(() => {
        result.current.handleInputChange("o");
      });
      act(() => {
        result.current.handleInputChange("or");
      });
      act(() => {
        result.current.handleInputChange("ora");
      });

      // Assert - should not call immediately
      expect(mockFetchOptions).not.toHaveBeenCalled();

      // Act - advance timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Assert - should only call once with last value
      expect(mockFetchOptions).toHaveBeenCalledTimes(1);
      expect(mockFetchOptions).toHaveBeenCalledWith("ora");
    });

    it("should wait full 500ms before calling fetch", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Act
      act(() => {
        result.current.handleInputChange("test");
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Assert - should not call yet
      expect(mockFetchOptions).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Assert - now it should call
      expect(mockFetchOptions).toHaveBeenCalledWith("test");
    });
  });

  describe("handleFocus", () => {
    it("should fetch with default query on first focus", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Act
      result.current.handleFocus();

      // Assert
      expect(mockFetchOptions).toHaveBeenCalledWith(DEFAULT_INITIAL_SEARCH_DATA.query);
    });

    it("should only fetch once on multiple focus calls", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      // Act
      result.current.handleFocus();
      result.current.handleFocus();
      result.current.handleFocus();

      // Assert
      expect(mockFetchOptions).toHaveBeenCalledTimes(1);
    });
  });

  // Converts 'Add new value: X' option to clean value when selected
  describe("transformCustomValue", () => {
    it("should strip 'Add new value:' prefix when user selects the custom value option", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "emerald",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      const customOption = {
        label: result.current.customValueLabel,
        value: "emerald",
      };

      // Act
      const transformed = result.current.transformCustomValue(customOption);

      // Assert
      expect(transformed).toEqual({
        label: "emerald",
        value: "emerald",
      });
    });

    it("should leave existing dropdown options unchanged", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAttributeDropdown({
          inputValue: "test",
          selectedValue: null,
          fetchOptions: mockFetchOptions,
        }),
      );

      const regularOption = {
        label: "Blue",
        value: "blue",
      };

      // Act
      const transformed = result.current.transformCustomValue(regularOption);

      // Assert
      expect(transformed).toEqual(regularOption);
    });
  });
});
