import { renderHook } from "@testing-library/react-hooks";
import { IntlShape } from "react-intl";

import {
  CutOffDateComparison,
  useAutomaticCompletionWarnings,
  UseAutomaticCompletionWarningsParams,
} from "./useAutomaticCompletionWarnings";
import * as utils from "./utils";

// Mock the utils module
jest.mock("./utils", () => ({
  formatTimeDifference: jest.fn(),
  formatDateTime: jest.fn(),
}));

describe("useAutomaticCompletionWarnings", () => {
  const mockIntl = {} as IntlShape;

  beforeEach(() => {
    jest.clearAllMocks();
    (utils.formatTimeDifference as jest.Mock).mockReturnValue("2 days");
    (utils.formatDateTime as jest.Mock).mockImplementation((date, time) => `${date} ${time}`);
  });

  describe("showDisabledInfo", () => {
    it("returns true when user disables previously enabled automatic completion", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: false,
        delay: 5,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showDisabledInfo).toBe(true);
    });

    it("returns false when automatic completion state has not changed", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showDisabledInfo).toBe(false);
    });

    it("returns false when user enables previously disabled automatic completion", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: false,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showDisabledInfo).toBe(false);
    });
  });

  describe("showZeroDelayWarning", () => {
    it("returns true when delay is numeric 0 and automatic completion is enabled", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 0,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: false,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showZeroDelayWarning).toBe(true);
    });

    it("returns true when delay is string '0' and automatic completion is enabled", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: "0",
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: false,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showZeroDelayWarning).toBe(true);
    });

    it("returns false when delay is non-zero", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: false,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showZeroDelayWarning).toBe(false);
    });

    it("returns false when automatic completion is disabled even if delay is 0", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: false,
        delay: 0,
        cutOffDate: "2024-12-15",
        cutOffTime: "14:00",
        savedIsEnabled: false,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showZeroDelayWarning).toBe(false);
    });
  });

  describe("cutOffDateComparison", () => {
    describe("when automatic completion is disabled", () => {
      it("returns empty comparison data", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: false,
          delay: 5,
          cutOffDate: "2024-12-20",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        const expected: CutOffDateComparison = {
          isEarlier: false,
          isLater: false,
          timeDifference: "",
          previousDate: "",
          newDate: "",
        };

        expect(result.current.cutOffDateComparison).toEqual(expected);
      });
    });

    describe("when cutOffDate is empty", () => {
      it("returns empty comparison data", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        const expected: CutOffDateComparison = {
          isEarlier: false,
          isLater: false,
          timeDifference: "",
          previousDate: "",
          newDate: "",
        };

        expect(result.current.cutOffDateComparison).toEqual(expected);
      });
    });

    describe("when savedCutOffDate is empty", () => {
      it("returns empty comparison data", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-15",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        const expected: CutOffDateComparison = {
          isEarlier: false,
          isLater: false,
          timeDifference: "",
          previousDate: "",
          newDate: "",
        };

        expect(result.current.cutOffDateComparison).toEqual(expected);
      });
    });

    describe("when new date is earlier than saved date", () => {
      it("sets isEarlier to true", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-10",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isEarlier).toBe(true);
        expect(result.current.cutOffDateComparison.isLater).toBe(false);
      });

      it("includes formatted dates and time difference", () => {
        // Arrange
        (utils.formatDateTime as jest.Mock).mockImplementation((date, time) => `${date} ${time}`);
        (utils.formatTimeDifference as jest.Mock).mockReturnValue("5 days");

        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-10",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.previousDate).toBe("2024-12-15 14:00");
        expect(result.current.cutOffDateComparison.newDate).toBe("2024-12-10 14:00");
        expect(result.current.cutOffDateComparison.timeDifference).toBe("5 days");
        expect(utils.formatDateTime).toHaveBeenCalledWith("2024-12-15", "14:00", mockIntl);
        expect(utils.formatDateTime).toHaveBeenCalledWith("2024-12-10", "14:00", mockIntl);
      });
    });

    describe("when new date is later than saved date", () => {
      it("sets isLater to true", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-20",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isLater).toBe(true);
        expect(result.current.cutOffDateComparison.isEarlier).toBe(false);
      });

      it("includes formatted dates and time difference", () => {
        // Arrange
        (utils.formatDateTime as jest.Mock).mockImplementation((date, time) => `${date} ${time}`);
        (utils.formatTimeDifference as jest.Mock).mockReturnValue("5 days");

        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-20",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.previousDate).toBe("2024-12-15 14:00");
        expect(result.current.cutOffDateComparison.newDate).toBe("2024-12-20 14:00");
        expect(result.current.cutOffDateComparison.timeDifference).toBe("5 days");
      });
    });

    describe("when dates are equal", () => {
      it("sets both isEarlier and isLater to false", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-15",
          cutOffTime: "14:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isEarlier).toBe(false);
        expect(result.current.cutOffDateComparison.isLater).toBe(false);
      });
    });

    describe("when time differs but date is same", () => {
      it("correctly identifies earlier time", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-15",
          cutOffTime: "10:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isEarlier).toBe(true);
        expect(result.current.cutOffDateComparison.isLater).toBe(false);
      });

      it("correctly identifies later time", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-15",
          cutOffTime: "18:00",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "14:00",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isLater).toBe(true);
        expect(result.current.cutOffDateComparison.isEarlier).toBe(false);
      });
    });

    describe("when time is empty", () => {
      it("defaults to 00:00 for both dates", () => {
        // Arrange
        const params: UseAutomaticCompletionWarningsParams = {
          isChecked: true,
          delay: 5,
          cutOffDate: "2024-12-15",
          cutOffTime: "",
          savedIsEnabled: true,
          savedCutOffDate: "2024-12-15",
          savedCutOffTime: "",
          intl: mockIntl,
        };

        // Act
        const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

        // Assert
        expect(result.current.cutOffDateComparison.isEarlier).toBe(false);
        expect(result.current.cutOffDateComparison.isLater).toBe(false);
        expect(utils.formatDateTime).toHaveBeenCalledWith("2024-12-15", "", mockIntl);
      });
    });
  });

  describe("showCutOffDateEarlierWarning", () => {
    it("returns true when new date is earlier than saved date", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-10",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showCutOffDateEarlierWarning).toBe(true);
    });

    it("returns false when new date is later than saved date", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-20",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showCutOffDateEarlierWarning).toBe(false);
    });
  });

  describe("showCutOffDateLaterInfo", () => {
    it("returns true when new date is later than saved date", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-20",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showCutOffDateLaterInfo).toBe(true);
    });

    it("returns false when new date is earlier than saved date", () => {
      // Arrange
      const params: UseAutomaticCompletionWarningsParams = {
        isChecked: true,
        delay: 5,
        cutOffDate: "2024-12-10",
        cutOffTime: "14:00",
        savedIsEnabled: true,
        savedCutOffDate: "2024-12-15",
        savedCutOffTime: "14:00",
        intl: mockIntl,
      };

      // Act
      const { result } = renderHook(() => useAutomaticCompletionWarnings(params));

      // Assert
      expect(result.current.showCutOffDateLaterInfo).toBe(false);
    });
  });
});
