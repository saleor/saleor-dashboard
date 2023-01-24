import { AppActionsHandler } from "@dashboard/apps/components/AppFrame/appActionsHandler";
import { renderHook } from "@testing-library/react-hooks";

describe("AppActionsHandler", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useHandleNotificationAction", () => {
    // todo - mock useNotifier
    it.todo("Calls useNotifier with payload from action", () => {
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

      // expect(useNotifier).toHaveBeenCalledTimes(1);
      // expect(useNotifier).toHaveBeenCalledWith({});
    });
  });
});
