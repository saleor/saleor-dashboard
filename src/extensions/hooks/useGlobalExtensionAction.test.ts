import { useUser } from "@dashboard/auth/useUser";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { useGlobalExtensionAction } from "@dashboard/extensions/hooks/useGlobalExtensionAction";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

jest.mock("@dashboard/auth/useUser");
jest.mock("@dashboard/extensions/hooks/useExtensions");

const makeExtension = (overrides: Partial<ExtensionWithParams>): ExtensionWithParams =>
  ({
    id: "ext-1",
    app: { id: "app-1", name: "Stripe", appUrl: "https://stripe.example", brand: null },
    accessToken: "token",
    permissions: [],
    label: "Stripe config",
    identifier: "stripe-channel-config",
    mountName: "SEARCH_ACTION",
    url: "/config",
    targetName: "POPUP",
    settings: null,
    isSaleorOfficial: false,
    fromCache: false,
    open: jest.fn(),
    ...overrides,
  }) as ExtensionWithParams;

const makeUser = (permissions: PermissionEnum[]): UserFragment =>
  ({
    userPermissions: permissions.map(code => ({ code, name: code })),
  }) as UserFragment;

const mockSearchActions = (extensions: ExtensionWithParams[]) => {
  (useExtensions as jest.Mock).mockReturnValue({ SEARCH_ACTION: extensions });
};

describe("useGlobalExtensionAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUser as jest.Mock).mockReturnValue({ user: makeUser([]) });
  });

  it("returns the extension matching the identifier", () => {
    // Arrange
    const extension = makeExtension({});

    mockSearchActions([makeExtension({ identifier: "other" }), extension]);

    // Act
    const { result } = renderHook(() => useGlobalExtensionAction("stripe-channel-config"));

    // Assert
    expect(result.current).toBe(extension);
  });

  it("returns undefined when no extension declares the identifier", () => {
    // Arrange
    mockSearchActions([makeExtension({ identifier: "other" })]);

    // Act
    const { result } = renderHook(() => useGlobalExtensionAction("stripe-channel-config"));

    // Assert
    expect(result.current).toBeUndefined();
  });

  it("returns the extension regardless of the target it declares", () => {
    // Arrange
    const extension = makeExtension({ targetName: "NEW_TAB" });

    mockSearchActions([extension]);

    // Act
    const { result } = renderHook(() => useGlobalExtensionAction("stripe-channel-config"));

    // Assert
    expect(result.current).toBe(extension);
  });

  it("returns undefined when the user lacks a permission the extension declares", () => {
    // Arrange
    mockSearchActions([makeExtension({ permissions: [PermissionEnum.HANDLE_PAYMENTS] })]);

    // Act
    const { result } = renderHook(() => useGlobalExtensionAction("stripe-channel-config"));

    // Assert
    expect(result.current).toBeUndefined();
  });

  it("returns the extension when the user has every permission it declares", () => {
    // Arrange
    const extension = makeExtension({ permissions: [PermissionEnum.HANDLE_PAYMENTS] });

    (useUser as jest.Mock).mockReturnValue({ user: makeUser([PermissionEnum.HANDLE_PAYMENTS]) });
    mockSearchActions([extension]);

    // Act
    const { result } = renderHook(() => useGlobalExtensionAction("stripe-channel-config"));

    // Assert
    expect(result.current).toBe(extension);
  });
});
