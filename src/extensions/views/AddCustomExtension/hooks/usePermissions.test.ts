import { PermissionEnum, PermissionFragment } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { renderHook } from "@testing-library/react-hooks";

import { usePermissions } from "./usePermissions";

jest.mock("@dashboard/hooks/useShop");

const mockUseShop = useShop as jest.Mock;

describe("usePermissions", () => {
  it("should sort permissions from shop context by name", () => {
    // Arrange
    const mockPermissions: PermissionFragment[] = [
      { __typename: "Permission", name: "Manage Products", code: PermissionEnum.MANAGE_PRODUCTS },
      { __typename: "Permission", name: "Manage Orders", code: PermissionEnum.MANAGE_ORDERS },
      { __typename: "Permission", name: "Manage Settings", code: PermissionEnum.MANAGE_SETTINGS },
    ];

    mockUseShop.mockReturnValue({
      permissions: mockPermissions,
    });

    // Act
    const { result } = renderHook(() => usePermissions());

    // Assert
    expect(result.current).toEqual([
      { __typename: "Permission", name: "Manage Orders", code: PermissionEnum.MANAGE_ORDERS },
      { __typename: "Permission", name: "Manage Products", code: PermissionEnum.MANAGE_PRODUCTS },
      { __typename: "Permission", name: "Manage Settings", code: PermissionEnum.MANAGE_SETTINGS },
    ]);
  });

  it("should handle empty permissions", () => {
    // Arrange
    mockUseShop.mockReturnValue({
      permissions: [],
    });

    // Act
    const { result } = renderHook(() => usePermissions());

    // Assert
    expect(result.current).toEqual([]);
  });

  it("should handle undefined permissions", () => {
    // Arrange
    mockUseShop.mockReturnValue({
      permissions: undefined,
    });

    // Act
    const { result } = renderHook(() => usePermissions());

    // Assert
    expect(result.current).toEqual([]);
  });
});
