import { INotification } from "@dashboard/components/notifications";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, renderHook } from "@testing-library/react-hooks";
import { PropsWithChildren } from "react";
import { IntlProvider } from "react-intl";
import { toast } from "sonner";

import { useNotifier } from "./useNotifier";

jest.mock("sonner", () => ({
  toast: {
    custom: jest.fn(),
  },
}));

const mockToastCustom = toast.custom as jest.Mock;

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

    it("calls toast.custom when notify is invoked", () => {
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
      expect(mockToastCustom).toHaveBeenCalledTimes(1);
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
      expect(mockToastCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: DEFAULT_NOTIFICATION_SHOW_TIME,
      });
    });

    it("uses Infinity duration for error notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "error", title: "Error" });
      });

      // Assert
      expect(mockToastCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: Infinity,
      });
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
      expect(mockToastCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: customAutohide,
      });
    });

    it("uses DEFAULT_NOTIFICATION_SHOW_TIME for info notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "info", title: "Info" });
      });

      // Assert
      expect(mockToastCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: DEFAULT_NOTIFICATION_SHOW_TIME,
      });
    });

    it("uses DEFAULT_NOTIFICATION_SHOW_TIME for warning notifications", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "warning", title: "Warning" });
      });

      // Assert
      expect(mockToastCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: DEFAULT_NOTIFICATION_SHOW_TIME,
      });
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Custom Title");
    });

    it("falls back to 'Success' for success status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "success" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Success");
    });

    it("falls back to 'Error' for error status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "error" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Error");
    });

    it("falls back to 'Warning' for warning status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "warning" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Warning");
    });

    it("falls back to 'Info' for info status without title", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ status: "info" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Info");
    });

    it("falls back to 'Info' when no status is provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({});
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.title).toBe("Info");
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.description).toBe("Description text");
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.description).toBe("API error message");
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.description).toBe("Primary description");
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.action).toEqual({
        label: "Undo",
        onClick: actionFn,
      });
    });

    it("does not pass action when actionBtn is not provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Title", status: "info" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.action).toBeUndefined();
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
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.type).toBe(expectedType);
    });

    it("defaults to 'info' type when status is not provided", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Test" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("test-id");

      expect(renderedElement.props.type).toBe("info");
    });
  });

  describe("toast id", () => {
    it("passes toast id to Toast component", () => {
      // Arrange
      const { result } = renderHook(() => useNotifier(), { wrapper });

      // Act
      act(() => {
        result.current({ title: "Test", status: "success" });
      });

      // Assert
      const renderFn = mockToastCustom.mock.calls[0][0];
      const renderedElement = renderFn("unique-toast-id");

      expect(renderedElement.props.id).toBe("unique-toast-id");
    });
  });
});
