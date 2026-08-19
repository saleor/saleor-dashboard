import { type INotification } from "@dashboard/components/notifications";
import { enqueueToast } from "@dashboard/components/notifications/notificationQueue";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, renderHook } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";

import { useNotifier } from "./useNotifier";

jest.mock("@dashboard/components/notifications/notificationQueue", () => ({
  enqueueToast: jest.fn(),
}));

const mockEnqueueToast = enqueueToast as jest.Mock;

const wrapper = ({ children }: PropsWithChildren) => (
  <IntlProvider locale="en" messages={{}}>
    <ThemeProvider>{children}</ThemeProvider>
  </IntlProvider>
);

describe("useNotifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("basic functionality", () => {
    it("returns notify function", () => {
      // Arrange & Act
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Assert
      expect(typeof result.current).toBe("function");
    });

    it("calls enqueueToast when notify is invoked", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });
      const notification: INotification = {
        title: "Test",
        status: "success",
      };

      // Act
      act(() => {
        result.current(notification);
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledTimes(1);
    });
  });

  describe("duration handling", () => {
    it("uses DEFAULT_NOTIFICATION_SHOW_TIME for success notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "success", title: "Success" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: DEFAULT_NOTIFICATION_SHOW_TIME,
        }),
      );
    });

    it("uses Infinity duration for error notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "error", title: "Error" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: Infinity,
        }),
      );
    });

    it("respects explicit autohide on error when the page owns recovery", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });
      const customAutohide = 5000;

      // Act
      act(() => {
        result.current({
          status: "error",
          title: "Couldn't save",
          autohide: customAutohide,
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: customAutohide,
        }),
      );
    });

    it("keeps actionBtn sticky even when autohide is set", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({
          status: "error",
          title: "Error",
          autohide: 5000,
          actionBtn: {
            label: "Undo",
            action: jest.fn(),
          },
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: Infinity,
        }),
      );
    });

    it("uses custom autohide value when provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });
      const customAutohide = 5000;

      // Act
      act(() => {
        result.current({
          status: "success",
          title: "Custom Duration",
          autohide: customAutohide,
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: customAutohide,
        }),
      );
    });

    it("uses DEFAULT_NOTIFICATION_SHOW_TIME for info notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "info", title: "Info" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: DEFAULT_NOTIFICATION_SHOW_TIME,
        }),
      );
    });

    it("uses DEFAULT_NOTIFICATION_SHOW_TIME for warning notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "warning", title: "Warning" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: DEFAULT_NOTIFICATION_SHOW_TIME,
        }),
      );
    });
  });

  describe("title fallback", () => {
    it("uses provided title when given", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Custom Title", status: "success" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Custom Title",
        }),
      );
    });

    it("falls back to 'Success' for success status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "success" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success",
        }),
      );
    });

    it("falls back to 'Error' for error status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "error" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
        }),
      );
    });

    it("falls back to 'Warning' for warning status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "warning" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Warning",
        }),
      );
    });

    it("falls back to 'Info' for info status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "info" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Info",
        }),
      );
    });

    it("falls back to 'Info' when no status is provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({});
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Info",
        }),
      );
    });
  });

  describe("description handling", () => {
    it("uses text as description when provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({
          title: "Title",
          text: "Description text",
          status: "info",
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Description text",
        }),
      );
    });

    it("uses apiMessage as description fallback when text is not provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({
          title: "Title",
          apiMessage: "API error message",
          status: "error",
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "API error message",
        }),
      );
    });

    it("prefers text over apiMessage when both are provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({
          title: "Title",
          text: "Primary description",
          apiMessage: "Fallback description",
          status: "info",
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Primary description",
        }),
      );
    });
  });

  describe("action button", () => {
    it("passes action configuration to Toast", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });
      const actionFn = jest.fn();

      // Act
      act(() => {
        result.current({
          title: "Title",
          status: "info",
          actionBtn: {
            label: "Undo",
            action: actionFn,
          },
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          action: {
            label: "Undo",
            onClick: actionFn,
          },
          duration: Infinity,
        }),
      );
    });

    it("keeps action toasts sticky until dismissed", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({
          title: "Title",
          status: "info",
          actionBtn: {
            label: "Undo",
            action: jest.fn(),
          },
        });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: Infinity,
        }),
      );
    });

    it("does not pass action when actionBtn is not provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Title", status: "info" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          action: undefined,
        }),
      );
    });
  });

  describe("toast type mapping", () => {
    it.each([
      ["success", "success"],
      ["error", "error"],
      ["warning", "warning"],
      ["info", "info"],
    ] as const)("maps status '%s' to toast type '%s'", (status, expectedType) => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Test", status });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expectedType,
        }),
      );
    });

    it("defaults to 'info' type when status is not provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Test" });
      });

      // Assert
      expect(mockEnqueueToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "info",
        }),
      );
    });
  });
});
