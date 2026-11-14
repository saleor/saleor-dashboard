import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { PermissionEnum, type UserPermissionFragment } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { useCanEditTaxConfigurationMetadata } from "./useCanEditTaxConfigurationMetadata";

jest.mock("@dashboard/auth/hooks/useUserPermissions");

const mockUseUserPermissions = useUserPermissions as jest.MockedFunction<typeof useUserPermissions>;

const permission = (code: PermissionEnum): UserPermissionFragment => ({
  __typename: "UserPermission",
  code,
  name: code,
});

describe("useCanEditTaxConfigurationMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([PermissionEnum.HANDLE_TAXES, PermissionEnum.MANAGE_TAXES])(
    "allows editing for a user with %s",
    code => {
      // Arrange
      mockUseUserPermissions.mockReturnValue([permission(code)]);

      // Act
      const { result } = renderHook(() => useCanEditTaxConfigurationMetadata());

      // Assert
      expect(result.current).toBe(true);
    },
  );

  it("does not allow editing for a user with only other permissions", () => {
    // Arrange
    mockUseUserPermissions.mockReturnValue([
      permission(PermissionEnum.MANAGE_CHANNELS),
      permission(PermissionEnum.MANAGE_SETTINGS),
    ]);

    // Act
    const { result } = renderHook(() => useCanEditTaxConfigurationMetadata());

    // Assert
    expect(result.current).toBe(false);
  });
});
