import { useAppPermissionsDialogState } from "@dashboard/apps/components/AppPermissionsDialog/AppPermissionsDialogState";
import { PermissionEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";

describe("useAppPermissionsDialogState", () => {
  it("Creates state with initial permissions - empty", () => {
    const {
      result: { current },
    } = renderHook(() => useAppPermissionsDialogState([]));

    expect(current.state.type).toEqual("pick-permissions");
    expect(current.state.selected).toEqual([]);
  });
  it("Creates state with initial permissions", () => {
    const {
      result: { current },
    } = renderHook(() =>
      useAppPermissionsDialogState([PermissionEnum.MANAGE_CHANNELS, PermissionEnum.MANAGE_ORDERS]),
    );

    expect(current.state.type).toEqual("pick-permissions");
    expect(current.state.selected).toEqual(["MANAGE_CHANNELS", "MANAGE_ORDERS"]);
  });
  describe("Transitions to confirmation screen with proper diff", () => {
    test("One added permission", async () => {
      const {
        result: { current },
        waitFor,
      } = renderHook(() =>
        useAppPermissionsDialogState([
          PermissionEnum.MANAGE_CHANNELS,
          PermissionEnum.MANAGE_ORDERS,
        ]),
      );

      current.updateSelected([
        PermissionEnum.MANAGE_CHANNELS,
        PermissionEnum.MANAGE_ORDERS,
        PermissionEnum.HANDLE_CHECKOUTS,
      ]);
      current.onConfirmSelection();
      waitFor(() => {
        expect(current.state.type).toEqual("confirm-permissions");

        if (current.state.type === "confirm-permissions") {
          expect(current.state.removedPermissions).toEqual([]);
          expect(current.state.addedPermissions).toEqual(["HANDLE_CHECKOUTS"]);
        } else {
          throw new Error();
        }
      });
    });
    test("One removed permission", async () => {
      const {
        result: { current },
        waitFor,
      } = renderHook(() =>
        useAppPermissionsDialogState([
          PermissionEnum.MANAGE_CHANNELS,
          PermissionEnum.MANAGE_ORDERS,
        ]),
      );

      current.updateSelected([PermissionEnum.MANAGE_CHANNELS]);
      current.onConfirmSelection();
      waitFor(() => {
        expect(current.state.type).toEqual("confirm-permissions");

        if (current.state.type === "confirm-permissions") {
          expect(current.state.removedPermissions).toEqual(["MANAGE_ORDERS"]);
          expect(current.state.addedPermissions).toEqual([""]);
        } else {
          throw new Error();
        }
      });
    });
    test("One added and one removed permission", async () => {
      const {
        result: { current },
        waitFor,
      } = renderHook(() =>
        useAppPermissionsDialogState([
          PermissionEnum.MANAGE_CHANNELS,
          PermissionEnum.MANAGE_ORDERS,
        ]),
      );

      current.updateSelected([PermissionEnum.MANAGE_CHANNELS, PermissionEnum.MANAGE_CHECKOUTS]);
      current.onConfirmSelection();
      waitFor(() => {
        expect(current.state.type).toEqual("confirm-permissions");

        if (current.state.type === "confirm-permissions") {
          expect(current.state.removedPermissions).toEqual(["MANAGE_ORDERS"]);
          expect(current.state.addedPermissions).toEqual(["HANDLE_CHECKOUTS"]);
        } else {
          throw new Error();
        }
      });
    });
  });
});
