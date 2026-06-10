import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { useCanEditCustomers } from "./useCanEditCustomers";

jest.mock("@dashboard/auth/hooks/useUserPermissions");

const mockUseUserPermissions = useUserPermissions as jest.Mock;

const permission = (code: PermissionEnum) => ({
  __typename: "UserPermission" as const,
  code,
  name: code,
});

describe("useCanEditCustomers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when MANAGE_USERS is present", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_USERS)]);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(true);
  });

  it("returns true when MANAGE_USERS is present alongside other permissions", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([
      permission(PermissionEnum.MANAGE_ORDERS),
      permission(PermissionEnum.MANAGE_USERS),
      permission(PermissionEnum.MANAGE_STAFF),
    ]);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(true);
  });

  it("returns false when only MANAGE_ORDERS is present", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_ORDERS)]);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(false);
  });

  it("returns false when only MANAGE_STAFF is present", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([permission(PermissionEnum.MANAGE_STAFF)]);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(false);
  });

  it("returns false when no permissions are present", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([]);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(false);
  });

  it("returns false when permissions are undefined (e.g. logged out)", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue(undefined);

    // Act
    const { result } = renderHook(() => useCanEditCustomers());

    // Assert
    expect(result.current).toBe(false);
  });
});
