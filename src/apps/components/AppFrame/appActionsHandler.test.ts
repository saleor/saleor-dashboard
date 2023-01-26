import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import * as ExternalAppContext from "@dashboard/apps/components/ExternalAppContext/ExternalAppContext";
import * as dashboardConfig from "@dashboard/config";
import { UseNotifierResult } from "@dashboard/hooks/useNotifier";
import { renderHook } from "@testing-library/react-hooks";
import * as ReactIntl from "react-intl";
import { IntlShape } from "react-intl";

const mockNotify = jest.fn();
const mockCloseExternalApp = jest.fn();
jest.mock(
  "@dashboard/hooks/useNotifier",
  (): UseNotifierResult => () => mockNotify,
);

jest.spyOn(ExternalAppContext, "useExternalApp").mockImplementation(() => ({
  close: mockCloseExternalApp,
  openApp: jest.fn(),
  open: true,
  closeApp: jest.fn(),
}));

jest
  .spyOn(dashboardConfig, "getAppMountUri")
  .mockImplementation(() => "http://localhost:3000");

jest.spyOn(ReactIntl, "useIntl").mockImplementation(
  // @ts-ignore - only mock required method
  (): Pick<IntlShape, "formatMessage"> => ({
    formatMessage: jest.fn(),
  }),
);

jest.mock("@dashboard/hooks/useNavigator", () => jest.fn());

describe("AppActionsHandler", function () {
  beforeEach(() => {
    // jest.clearAllMocks();
  });

  describe("useHandleNotificationAction", () => {
    it("Calls useNotifier with payload from action", () => {
      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useHandleNotificationAction());

      handle({
        type: "notification",
        payload: {
          actionId: "test",
          status: "success",
          text: "Test content",
          title: "Test title",
        },
      });

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
      const mockHistoryPushState = jest.fn();
      jest
        .spyOn(window.history, "pushState")
        .mockImplementation(mockHistoryPushState);

      const {
        result: {
          current: { handle },
        },
      } = renderHook(() => AppActionsHandler.useUpdateRoutingAction("XYZ"));

      handle({
        type: "updateRouting",
        payload: {
          actionId: "123",
          newRoute: "/foo/bar",
        },
      });

      expect(mockHistoryPushState).toHaveBeenCalledTimes(1);
      expect(mockHistoryPushState).toHaveBeenCalledWith(
        null,
        "",
        "http://localhost:3000/apps/XYZ/app/foo/bar",
      );
    });
  });
  describe("useHandleRedirectAction", () => {
    describe("Open in the new browser context", () => {
      let hookRenderResult = renderHook(() =>
        AppActionsHandler.useHandleRedirectAction("XYZ"),
      );

      let mockWindowOpen = jest.fn();

      beforeEach(() => {
        hookRenderResult = renderHook(() =>
          AppActionsHandler.useHandleRedirectAction("XYZ"),
        );
        mockWindowOpen = jest.fn();

        jest.spyOn(window, "open").mockImplementation(mockWindowOpen);
      });

      it("Opens external URL in new browser context", () => {
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "https://google.com",
            newContext: true,
          },
        });

        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith("https://google.com");
      });

      it("Opens another dashboard url in new browser context", () => {
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/orders",
            newContext: true,
          },
        });

        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith(
          "http://localhost:3000/orders",
        );
      });

      /**
       * This behavior is pretty bad, because app must prefix with /apps/:id/app/*
       *
       * TODO Drop this behavior, updateRouting action can do that explicitely
       */
      it("Opens another app route in new browser context", () => {
        hookRenderResult.result.current.handle({
          type: "redirect",
          payload: {
            actionId: "123",
            to: "/apps/XYZ/app/config",
            newContext: true,
          },
        });

        expect(mockWindowOpen).toHaveBeenCalledTimes(1);
        expect(mockWindowOpen).toHaveBeenCalledWith(
          "http://localhost:3000/apps/XYZ/app/config",
        );
      });
    });

    describe("Open in new the same browser context", () => {
      it.todo("Opens external URL in new browser context");

      it.todo("Opens another dashboard url in new browser context");

      it.todo("Opens another app route in new browser context");
    });
  });
});
