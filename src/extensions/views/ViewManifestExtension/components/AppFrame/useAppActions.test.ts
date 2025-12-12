import { Actions } from "@saleor/app-sdk/app-bridge";
import { captureMessage } from "@sentry/react";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";

import { AppActionsHandler } from "./appActionsHandler";
import { useAppActions } from "./useAppActions";
import { usePostToExtension } from "./usePostToExtension";

// Mock dependencies
jest.mock("@sentry/react", () => ({
  captureMessage: jest.fn(),
}));

const mockNotifier = jest.fn();

jest.mock("@dashboard/hooks/useNotifier", () => (): jest.Mock => mockNotifier);

jest.mock("./usePostToExtension");

jest.mock("./appActionsHandler", () => ({
  AppActionsHandler: {
    useHandleNotificationAction: jest.fn(),
    useHandleUpdateRoutingAction: jest.fn(),
    useHandleRedirectAction: jest.fn(),
    useNotifyReadyAction: jest.fn(),
    useHandlePermissionRequest: jest.fn(),
    useHandleAppFormUpdate: jest.fn(),
  },
}));

const mockCaptureMessage = captureMessage as jest.MockedFunction<typeof captureMessage>;
const mockUsePostToExtension = usePostToExtension as jest.MockedFunction<typeof usePostToExtension>;

describe("useAppActions", () => {
  const mockFrameEl = document.createElement("iframe") as HTMLIFrameElement;
  const mockAppOrigin = "https://app.example.com";
  const mockAppId = "app-123";
  const mockAppToken = "token-123";
  const mockVersions = {
    core: "1.0.0",
    dashboard: "2.0.0",
  };

  const mockPostToExtension = jest.fn();
  const mockHandleNotification = jest.fn();
  const mockHandleUpdateRouting = jest.fn();
  const mockHandleRedirect = jest.fn();
  const mockHandleNotifyReady = jest.fn();
  const mockHandlePermissionRequest = jest.fn();
  const mockHandleAppFormUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockUsePostToExtension.mockReturnValue(mockPostToExtension);

    (AppActionsHandler.useHandleNotificationAction as jest.Mock).mockReturnValue({
      handle: mockHandleNotification,
    });
    (AppActionsHandler.useHandleUpdateRoutingAction as jest.Mock).mockReturnValue({
      handle: mockHandleUpdateRouting,
    });
    (AppActionsHandler.useHandleRedirectAction as jest.Mock).mockReturnValue({
      handle: mockHandleRedirect,
    });
    (AppActionsHandler.useNotifyReadyAction as jest.Mock).mockReturnValue({
      handle: mockHandleNotifyReady,
    });
    (AppActionsHandler.useHandlePermissionRequest as jest.Mock).mockReturnValue({
      handle: mockHandlePermissionRequest,
    });
    (AppActionsHandler.useHandleAppFormUpdate as jest.Mock).mockReturnValue({
      handle: mockHandleAppFormUpdate,
    });

    // Reset capture message mock to return a proper scope
    mockCaptureMessage.mockImplementation((_message, callback) => {
      if (typeof callback === "function") {
        const mockScope = {
          setLevel: jest.fn().mockReturnThis(),
          setContext: jest.fn().mockReturnThis(),
        };

        callback(mockScope as any);
      }

      return "";
    });
  });

  it("should capture unknown action type to Sentry and show notification", () => {
    // Arrange
    const unknownActionType = "unknownAction";
    const unknownAction = {
      type: unknownActionType,
      payload: { some: "data" },
    } as unknown as Actions;

    renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Act
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: mockAppOrigin,
          data: unknownAction,
        }),
      );
    });

    // Assert
    expect(mockCaptureMessage).toHaveBeenCalledWith(
      "Unknown action type requested by the App",
      expect.any(Function),
    );

    // Verify Sentry scope was configured correctly
    const scopeCallback = mockCaptureMessage.mock.calls[0][1];
    const mockScope = {
      setLevel: jest.fn().mockReturnThis(),
      setContext: jest.fn().mockReturnThis(),
    };

    if (typeof scopeCallback === "function") {
      scopeCallback(mockScope as any);

      expect(mockScope.setLevel).toHaveBeenCalledWith("warning");
      expect(mockScope.setContext).toHaveBeenCalledWith("action", {
        actionType: unknownActionType,
        appId: mockAppId,
      });
    }

    // Verify notification was shown to user
    expect(mockNotifier).toHaveBeenCalledWith({
      title: "Invalid app event",
      status: "error",
      text: `App has sent invalid event type "${unknownActionType}". Contact app developer.`,
    });
  });

  it("should ignore messages from different origins", () => {
    // Arrange
    const differentOrigin = "https://malicious.example.com";
    const validAction = {
      type: "notification",
      payload: {
        actionId: "action-1",
        title: "Test",
        status: "success",
      },
    } as Actions;

    renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Act
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: differentOrigin,
          data: validAction,
        }),
      );
    });

    // Assert
    expect(mockHandleNotification).not.toHaveBeenCalled();
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  it("should handle notification action", () => {
    // Arrange
    const notificationAction = {
      type: "notification",
      payload: {
        actionId: "action-1",
        title: "Test notification",
        status: "success",
      },
    } as Actions;

    const mockResponse = {
      type: "response",
      payload: { actionId: "action-1", ok: true },
    };

    mockHandleNotification.mockReturnValue(mockResponse);

    renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Act
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: mockAppOrigin,
          data: notificationAction,
        }),
      );
    });

    // Assert
    expect(mockHandleNotification).toHaveBeenCalledWith(notificationAction);
    expect(mockPostToExtension).toHaveBeenCalledWith(mockResponse);
  });

  it("should handle notifyReady action and set handshake done", () => {
    // Arrange
    const notifyReadyAction = {
      type: "notifyReady",
      payload: {
        actionId: "action-1",
      },
    } as Actions;

    const mockResponse = {
      type: "response",
      payload: { actionId: "action-1", ok: true },
    };

    mockHandleNotifyReady.mockReturnValue(mockResponse);

    const { result } = renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Assert initial state
    expect(result.current.handshakeDone).toBe(false);

    // Act
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: mockAppOrigin,
          data: notifyReadyAction,
        }),
      );
    });

    // Assert
    expect(mockHandleNotifyReady).toHaveBeenCalledWith(notifyReadyAction);
    expect(mockPostToExtension).toHaveBeenCalledWith(mockResponse);
    expect(result.current.handshakeDone).toBe(true);
  });

  it("should not post response when handler returns void", () => {
    // Arrange
    const notificationAction = {
      type: "notification",
      payload: {
        actionId: "action-1",
        title: "Test",
        status: "success",
      },
    } as Actions;

    mockHandleNotification.mockReturnValue(undefined);

    renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Act
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          origin: mockAppOrigin,
          data: notificationAction,
        }),
      );
    });

    // Assert
    expect(mockHandleNotification).toHaveBeenCalledWith(notificationAction);
    expect(mockPostToExtension).not.toHaveBeenCalled();
  });

  it("should clean up event listener on unmount", () => {
    // Arrange
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() =>
      useAppActions(mockFrameEl, mockAppOrigin, mockAppId, mockAppToken, mockVersions),
    );

    // Act
    unmount();

    // Assert
    expect(removeEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
