import * as dashboardConfig from "@dashboard/config";
import { renderHook } from "@testing-library/react-hooks";
import * as ReactIntl from "react-intl";
import { IntlShape } from "react-intl";

import * as ExternalAppContext from "../ExternalAppContext/ExternalAppContext";
import { AppActionsHandler } from "./appActionsHandler";

jest.mock("@dashboard/config", () => {
  const actualModule = jest.requireActual("@dashboard/config");

  return {
    __esModule: true,
    ...actualModule,
  };
});
jest.mock("../ExternalAppContext/ExternalAppContext");

const mockNotify = jest.fn();
const mockCloseExternalApp = jest.fn();
const mockDeactivate = jest.fn();

jest.mock(
  "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider",
  () => ({
    useActiveAppExtension: () => ({
      active: null,
      activate: jest.fn(),
      deactivate: mockDeactivate,
      attachFormState: jest.fn(),
      attachFormResponseFrame: jest.fn(),
      framesByFormType: {},
    }),
  }),
);

jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: () => mockNotify,
}));
jest.spyOn(ExternalAppContext, "useExternalApp").mockImplementation(() => ({
  close: mockCloseExternalApp,
  openApp: jest.fn(),
  open: true,
  closeApp: jest.fn(),
}));
jest
  .spyOn(dashboardConfig, "getAppMountUri")
  // getAppMountUri is not an URI, it's a pathname
  .mockImplementation(() => "/dashboard/");
jest.spyOn(ReactIntl, "useIntl").mockImplementation(
  // @ts-expect-error - only mock required method
  (): Pick<IntlShape, "formatMessage"> => ({
    formatMessage: jest.fn(),
  }),
);

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);
describe("AppActionsHandler", function () {
  const { location } = window;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  /**
   * jsdom doesn't allow src code to write to window.location.href,
   * so totally replace this object so its writeable
   *
   * @see https://wildwolf.name/jest-how-to-mock-window-location-href/
   */
  beforeEach((): void => {
    delete (window as { location?: unknown }).location;
    // Mock window.location for testing purposes
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost:3000",
        hostname: "localhost",
        pathname: "/extensions/XYZ",
      },
      writable: true,
      configurable: true,
    });
  });
  afterAll((): void => {
    Object.defineProperty(window, "location", {
      value: location,
      writable: true,
      configurable: true,
    });
  });
  describe("useHandleNotificationAction", () => {
    it("Calls useNotifier with payload from action", () => {
      // Arrange
      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useHandleNotificationAction());

      // Act
      handle({
        type: "notification",
        payload: {
          actionId: "test",
          status: "success",
          text: "Test content",
          title: "Test title",
        },
      });

      // Assert
      expect(mockNotify).toHaveBeenCalledTimes(1);
      expect(mockNotify).toHaveBeenCalledWith({
        status: "success",
        text: "Test content",
        title: "Test title",
      });
    });
  });
  describe("useUpdateRoutingAction", () => {
    it("Updates dashboard url properly", () => {
      // Arrange
      const mockHistoryPushState = jest.fn();

      jest.spyOn(window.history, "pushState").mockImplementation(mockHistoryPushState);

      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useHandleUpdateRoutingAction("XYZ"));

      // Act
      handle({
        type: "updateRouting",
        payload: {
          actionId: "123",
          newRoute: "/foo/bar",
        },
      });

      // Assert
      expect(mockHistoryPushState).toHaveBeenCalledTimes(1);
      expect(mockHistoryPushState).toHaveBeenCalledWith(
        null,
        "",
        "/dashboard/extensions/app/XYZ/foo/bar",
      );
    });

    it("Does not update url if it's already updated", () => {
      // Arrange
      const mockHistoryPushState = jest.fn();

      window.location.pathname = "/dashboard/extensions/app/XYZ/foo/bar";
      jest.spyOn(window.history, "pushState").mockImplementation(mockHistoryPushState);

      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useHandleUpdateRoutingAction("XYZ"));

      // Act
      handle({
        type: "updateRouting",
        payload: {
          actionId: "123",
          newRoute: "/foo/bar",
        },
      });

      // Assert
      expect(mockHistoryPushState).not.toHaveBeenCalled();
    });
  });
  describe("useHandleRedirectAction", () => {
    describe("Open in the new browser context", () => {
      let hookRenderResult = renderHook(() => AppActionsHandler.useHandleRedirectAction("XYZ"));

      let mockWindowOpen = jest.fn();

      beforeEach(() => {
        hookRenderResult = renderHook(() => AppActionsHandler.useHandleRedirectAction("XYZ"));
        mockWindowOpen = jest.fn();
        jest.spyOn(window, "open").mockImplementation(mockWindowOpen);
      });
      it("Opens external URL in new browser context", () => {
        // Arrange & Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "https://google.com",
            newContext: true,
          },
        });

        // Assert
        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith("https://google.com");
      });
      it("Opens another dashboard url in new browser context", () => {
        // Arrange & Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/orders",
            newContext: true,
          },
        });

        // Assert
        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith("/dashboard/orders");
      });
      /**
       * This behavior is pretty bad, because app must prefix with /extensions/:id/app/*
       *
       * TODO Drop this behavior, updateRouting action can do that explicitely
       */
      it("Opens another app route in new browser context", () => {
        // Arrange & Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/extensions/XYZ/app/config",
            newContext: true,
          },
        });

        // Assert
        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith("/dashboard/extensions/XYZ/app/config");
      });
    });
    describe("Open in new the same browser context", () => {
      jest.spyOn(window, "confirm").mockReturnValue(true);

      const hookRenderResult = renderHook(() => AppActionsHandler.useHandleRedirectAction("XYZ"));

      it("Redirects to external URL after confirmation", () => {
        // Arrange & Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "https://google.com",
            newContext: false,
          },
        });

        // Assert
        expect(window.location.href).toBe("https://google.com");
      });
      it("Opens another dashboard url", () => {
        // Arrange & Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/orders",
            newContext: false,
          },
        });

        // Assert
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/orders");
      });
      it("Update route within the same app", () => {
        // Arrange
        const mockHistoryPushState = jest.fn();

        jest.spyOn(window.history, "pushState").mockImplementation(mockHistoryPushState);
        window.location.pathname = "/extensions/app/XYZ/foo";

        // Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/extensions/app/XYZ/config",
            newContext: false,
          },
        });

        // Assert
        expect(mockHistoryPushState).toHaveBeenCalledTimes(1);
        expect(mockHistoryPushState).toHaveBeenCalledWith(
          null,
          "",
          "/dashboard/extensions/app/XYZ/config",
        );
      });

      it("Update route within the same app if used legacy /app path", () => {
        /* Some apps might have used path in dashboard to /apps/XYZ/app/... as a way
         * to change it's own URL - we still need to support this even though apps are now in
         * /extensions/app/XYZ/...
         **/

        // Arrange
        const mockHistoryPushState = jest.fn();

        jest.spyOn(window.history, "pushState").mockImplementation(mockHistoryPushState);
        window.location.pathname = "/extensions/app/XYZ/foo";

        // Act
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/apps/XYZ/app/config",
            newContext: false,
          },
        });

        // Assert
        expect(mockHistoryPushState).toHaveBeenCalledTimes(1);
        expect(mockHistoryPushState).toHaveBeenCalledWith(
          null,
          "",
          "/dashboard/extensions/app/XYZ/config?",
        );
      });
    });
  });
  describe("useHandlePopupCloseAction", () => {
    it("Calls deactivate and returns ok response", () => {
      // Arrange
      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useHandlePopupCloseAction());

      // Act
      const response = handle({
        type: "popupClose",
        payload: {
          actionId: "test-popup-close",
        },
      });

      // Assert
      expect(mockDeactivate).toHaveBeenCalledTimes(1);
      expect(response).toEqual({
        type: "response",
        payload: {
          actionId: "test-popup-close",
          ok: true,
        },
      });
    });
  });
  describe("useHandlePermissionRequest", () => {
    it("Redirects to a dedicated page with params from action", () => {
      // Arrange
      const hookRenderResult = renderHook(() =>
        AppActionsHandler.useHandlePermissionRequest("XYZ"),
      );

      // Act
      hookRenderResult.result.current.handle({
        type: "requestPermissions",
        payload: {
          actionId: "123",
          permissions: ["MANAGE_ORDERS", "MANAGE_CHANNELS"],
          redirectPath: "/permissions-result",
        },
      });

      // Assert
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        "/extensions/app/XYZ/edit/permissions?redirectPath=%2Fpermissions-result&requestedPermissions=MANAGE_ORDERS%2CMANAGE_CHANNELS",
      );
    });
  });
});
