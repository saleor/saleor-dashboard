import { useUser } from "@dashboard/auth";
import { UserContext } from "@dashboard/auth/types";
import { PermissionEnum, PermissionFragment, UserFragment } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { renderHook } from "@testing-library/react-hooks";

import { useUserAppCreationPermissions } from "./useUserAppCreationPermissions";

jest.mock("@dashboard/auth");
jest.mock("@dashboard/hooks/useShop");

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseShop = useShop as jest.MockedFunction<typeof useShop>;

describe("useUserAppCreationPermissions", () => {
  const allPermissions: PermissionFragment[] = [
    { __typename: "Permission", code: PermissionEnum.MANAGE_APPS, name: "Manage apps" },
    { __typename: "Permission", code: PermissionEnum.MANAGE_ORDERS, name: "Manage orders" },
    { __typename: "Permission", code: PermissionEnum.MANAGE_PRODUCTS, name: "Manage products" },
  ];

  const defaultUserMock = {
    isAuthenticating: false,
    logout: jest.fn(),
    userCanRunJob: jest.fn(),
    isAuthenticated: true,
    refetchUser: jest.fn(),
  } as const;

  it("should return false when user has all shop permissions", () => {
    // Arrange
    mockUseUser.mockReturnValue({
      ...defaultUserMock,
      user: {
        userPermissions: allPermissions,
      } as unknown as UserFragment,
    } as unknown as UserContext);
    mockUseShop.mockReturnValue({
      permissions: allPermissions,
    } as ReturnType<typeof useShop>);

    // Act
    const { result } = renderHook(() => useUserAppCreationPermissions());

    // Assert
    expect(result.current).toBe(false);
  });

  it("should return true when user is missing some shop permissions", () => {
    // Arrange
    mockUseUser.mockReturnValue({
      ...defaultUserMock,
      user: {
        userPermissions: [allPermissions[0]], // Only has MANAGE_APPS
      } as unknown as UserFragment,
    } as unknown as UserContext);
    mockUseShop.mockReturnValue({
      permissions: allPermissions, // Shop has all three
    } as ReturnType<typeof useShop>);

    // Act
    const { result } = renderHook(() => useUserAppCreationPermissions());

    // Assert
    expect(result.current).toBe(true);
  });

  it("should return true when user has no permissions", () => {
    // Arrange
    mockUseUser.mockReturnValue({
      ...defaultUserMock,
      user: {
        userPermissions: [], // No permissions
      } as unknown as UserFragment,
    } as unknown as UserContext);
    mockUseShop.mockReturnValue({
      permissions: allPermissions,
    } as ReturnType<typeof useShop>);

    // Act
    const { result } = renderHook(() => useUserAppCreationPermissions());

    // Assert
    expect(result.current).toBe(true);
  });

  it("should return true when user data is unavailable", () => {
    // Arrange
    mockUseUser.mockReturnValue({
      ...defaultUserMock,
      user: undefined,
      isAuthenticated: false,
    } as unknown as UserContext);
    mockUseShop.mockReturnValue({
      permissions: allPermissions,
    } as ReturnType<typeof useShop>);

    // Act
    const { result } = renderHook(() => useUserAppCreationPermissions());

    // Assert
    expect(result.current).toBe(true); // When user is undefined, we treat it as having no permissions
  });

  it("should return false when shop data is unavailable", () => {
    // Arrange
    mockUseUser.mockReturnValue({
      ...defaultUserMock,
      user: {
        userPermissions: allPermissions,
      } as unknown as UserFragment,
    } as unknown as UserContext);
    mockUseShop.mockReturnValue({
      permissions: undefined, // No shop permissions data
    } as unknown as ReturnType<typeof useShop>);

    // Act
    const { result } = renderHook(() => useUserAppCreationPermissions());

    // Assert
    expect(result.current).toBe(false); // Falls back to empty array, difference is 0
  });
});
