import { act, renderHook } from "@testing-library/react-hooks";

import { useAutomaticCompletionHandlers } from "./useAutomaticCompletionHandlers";

describe("useAutomaticCompletionHandlers", () => {
  const mockOnCheckboxChange = jest.fn();
  const mockOnCutOffDateChange = jest.fn();
  const mockOnCutOffTimeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleMainCheckboxChange", () => {
    it("calls onCheckboxChange when invoked", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleMainCheckboxChange();
      });

      // Assert
      expect(mockOnCheckboxChange).toHaveBeenCalledTimes(1);
    });

    it("does not call date or time change handlers", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleMainCheckboxChange();
      });

      // Assert
      expect(mockOnCutOffDateChange).not.toHaveBeenCalled();
      expect(mockOnCutOffTimeChange).not.toHaveBeenCalled();
    });
  });

  describe("handleSetCurrentDateTime", () => {
    beforeEach(() => {
      // Mock current date to 2024-12-15 14:30:45
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-12-15T14:30:45"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("sets current date and time when invoked", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-10",
          savedCutOffTime: "10:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleSetCurrentDateTime();
      });

      // Assert
      expect(mockOnCutOffDateChange).toHaveBeenCalledTimes(1);
      expect(mockOnCutOffDateChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffDate",
          value: "2024-12-15",
        },
      });
    });

    it("formats time correctly as HH:MM", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-10",
          savedCutOffTime: "10:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleSetCurrentDateTime();
      });

      // Assert
      expect(mockOnCutOffTimeChange).toHaveBeenCalledTimes(1);
      expect(mockOnCutOffTimeChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffTime",
          value: "14:30",
        },
      });
    });

    it("does not call checkbox change handler", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-10",
          savedCutOffTime: "10:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleSetCurrentDateTime();
      });

      // Assert
      expect(mockOnCheckboxChange).not.toHaveBeenCalled();
    });
  });

  describe("handleResetToSaved", () => {
    it("resets to saved date and time when invoked", () => {
      // Arrange
      const savedDate = "2024-12-10";
      const savedTime = "10:00";
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: savedDate,
          savedCutOffTime: savedTime,
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleResetToSaved();
      });

      // Assert
      expect(mockOnCutOffDateChange).toHaveBeenCalledTimes(1);
      expect(mockOnCutOffDateChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffDate",
          value: savedDate,
        },
      });
      expect(mockOnCutOffTimeChange).toHaveBeenCalledTimes(1);
      expect(mockOnCutOffTimeChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffTime",
          value: savedTime,
        },
      });
    });

    it("works with empty saved values", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "",
          savedCutOffTime: "",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleResetToSaved();
      });

      // Assert
      expect(mockOnCutOffDateChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffDate",
          value: "",
        },
      });
      expect(mockOnCutOffTimeChange).toHaveBeenCalledWith({
        target: {
          name: "automaticCompletionCutOffTime",
          value: "",
        },
      });
    });

    it("does not call checkbox change handler", () => {
      // Arrange
      const { result } = renderHook(() =>
        useAutomaticCompletionHandlers({
          savedCutOffDate: "2024-12-10",
          savedCutOffTime: "10:00",
          onCheckboxChange: mockOnCheckboxChange,
          onCutOffDateChange: mockOnCutOffDateChange,
          onCutOffTimeChange: mockOnCutOffTimeChange,
        }),
      );

      // Act
      act(() => {
        result.current.handleResetToSaved();
      });

      // Assert
      expect(mockOnCheckboxChange).not.toHaveBeenCalled();
    });
  });
});
