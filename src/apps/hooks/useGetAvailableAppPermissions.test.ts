import { PermissionEnum } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { renderHook } from "@testing-library/react-hooks";

import { useGetAvailableAppPermissions } from "./useGetAvailableAppPermissions";

type PermissionsFromApi = Array<{
  __typename: "Permission";
  code: PermissionEnum;
  name: string;
}>;

const getMockUseShopHookResult = () => {
  const permissions: PermissionsFromApi = [
    {
      __typename: "Permission",
      name: "Manage Orders",
      code: PermissionEnum.MANAGE_ORDERS,
    },
    {
      __typename: "Permission",
      code: PermissionEnum.HANDLE_TAXES,
      name: "Handle Taxes",
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_CHANNELS,
      name: "Manage Channels",
    },
    {
      __typename: "Permission",
      code: PermissionEnum.MANAGE_APPS,
      name: "Manage Apps",
    },
  ];

  return {
    permissions,
  };
};

jest.mock("@dashboard/hooks/useShop");
describe("useGetAvailableAppPermissions", () => {
  beforeEach(() => {
    (useShop as jest.Mock).mockImplementationOnce(getMockUseShopHookResult);
  });
  it("Exposes permissons provided from useShop hook", () => {
    const hookResult = renderHook(() => useGetAvailableAppPermissions());

    expect(hookResult.result.current.availablePermissions).toEqual([
      {
        name: "Manage Orders",
        code: PermissionEnum.MANAGE_ORDERS,
      },
      {
        name: "Handle Taxes",
        code: PermissionEnum.HANDLE_TAXES,
      },
      {
        code: PermissionEnum.MANAGE_CHANNELS,
        name: "Manage Channels",
      },
    ]);
  });
  it("Filters out MANAGE_APPS permission, because app should not have one", () => {
    const hookResult = renderHook(() => useGetAvailableAppPermissions());
    const resultPermissions = hookResult.result.current.availablePermissions;
    const manageAppsPermission = resultPermissions.find(
      perm => perm.code === PermissionEnum.MANAGE_APPS,
    );

    expect(manageAppsPermission).toBeUndefined();
  });
  describe("mapCodesToNames method", () => {
    it("Maps provided code enums and returns its names from the API", () => {
      const hookResult = renderHook(() => useGetAvailableAppPermissions());
      const resultNames = hookResult.result.current.mapCodesToNames([
        PermissionEnum.MANAGE_ORDERS,
        PermissionEnum.HANDLE_TAXES,
      ]);

      expect(resultNames).toEqual(["Manage Orders", "Handle Taxes"]);
    });
    it("Throws if useShop is not available", () => {
      jest.resetAllMocks();
      (useShop as jest.Mock).mockImplementationOnce(() => undefined);

      const hookResult = renderHook(() => useGetAvailableAppPermissions());

      expect(() =>
        hookResult.result.current.mapCodesToNames([PermissionEnum.MANAGE_ORDERS]),
      ).toThrow();
    });
  });
});
