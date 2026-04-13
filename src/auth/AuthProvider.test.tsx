import { useApolloClient } from "@apollo/client";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { act, renderHook } from "@testing-library/react-hooks";
import { useIntl } from "react-intl";

import { useAuthProvider } from "./hooks/useAuthProvider";

const originalWindowNavigator = window.navigator;
const adminCredentials = {
  email: "admin@example.com",
  password: "admin",
  token: null,
};
const nonStaffUserCredentials = {
  email: "client@example.com",
  password: "password",
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  Object.defineProperty(window, "navigator", {
    configurable: true,
    enumerable: true,
    value: {
      credentials: {
        get: jest.fn(),
      },
    },
  });
});
afterAll(() => {
  Object.defineProperty(window, "navigator", {
    configurable: true,
    enumerable: true,
    value: originalWindowNavigator,
  });
});
jest.mock("@dashboard/auth/tokenStorage", () => ({
  storage: {
    getRefreshToken: jest.fn(() => null),
    getAuthPluginId: jest.fn(() => null),
    setAccessToken: jest.fn(),
    setTokens: jest.fn(),
    clear: jest.fn(),
  },
}));
jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");

  return {
    ...actual,
    useApolloClient: jest.fn(() => ({
      clearStore: jest.fn(),
      mutate: jest.fn(() =>
        Promise.resolve({
          data: {
            tokenCreate: {
              errors: [],
              token: "test-token",
              refreshToken: "test-refresh",
              user: {
                id: "1",
                email: "admin@example.com",
                firstName: "Admin",
                lastName: "User",
                isStaff: true,
                userPermissions: [
                  {
                    code: "MANAGE_USERS",
                    name: "Handle checkouts",
                  },
                ],
              },
            },
          },
        }),
      ),
    })),
  };
});
jest.mock("@dashboard/graphql", () => {
  const actualModule = jest.requireActual("@dashboard/graphql");

  return {
    __esModule: true,
    ...actualModule,
  };
});
jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: jest.fn(() => () => undefined),
}));
jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));
jest.mock("@dashboard/hooks/useLocalStorage", () => ({
  __esModule: true,
  default: jest.fn(() => []),
}));
jest.mock("@dashboard/auth", () => ({
  useUser: jest.fn(),
}));
jest.mock("use-react-router", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    location: {},
  })),
}));
describe("AuthProvider", () => {
  it("Staff user will be logged in if has valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    await act(async () => {
      hook.result.current.login!(adminCredentials.email, adminCredentials.password);
    });
    // Assert
    expect(hook.result.current.authenticated).toBe(true);
  });
  it("User will not be logged in if doesn't have valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    // Assert
    expect(hook.result.current.user).toBe(null);
    expect(hook.result.current.authenticated).toBe(false);
  });
  it("Non-staff user will not be logged in", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient() as any;

    apolloClient.mutate = jest.fn(() =>
      Promise.resolve({
        data: {
          tokenCreate: {
            errors: [],
            token: "test-token",
            refreshToken: "test-refresh",
            user: {
              id: "3",
              email: "client@example.com",
              firstName: "Client",
              lastName: "User",
              isStaff: false,
              userPermissions: [{ code: "MANAGE_ORDERS", name: "Manage orders" }],
            },
          },
        },
      }),
    );

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    await act(async () => {
      hook.result.current.login!(nonStaffUserCredentials.email, nonStaffUserCredentials.password);
    });
    // Assert
    expect(hook.result.current.authenticated).toBe(false);
  });
  it("Should logout user without userPermissions", async () => {
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient() as any;

    apolloClient.mutate = jest.fn(() =>
      Promise.resolve({
        data: {
          tokenCreate: {
            errors: [],
            token: "test-token",
            refreshToken: "test-refresh",
            user: {
              id: "2",
              email: "client@example.com",
              firstName: "Client",
              lastName: "User",
              isStaff: false,
              userPermissions: [],
            },
          },
        },
      }),
    );

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    await act(async () => {
      hook.result.current.login!(nonStaffUserCredentials.email, nonStaffUserCredentials.password);
    });
    // Assert
    expect(hook.result.current.errors).toEqual(["noPermissionsError"]);
    expect(hook.result.current.authenticated).toBe(false);
  });

  it("should handle concurrent login attempts correctly", async () => {
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient() as any;

    const mutateMock = jest.fn(() =>
      Promise.resolve({
        data: {
          tokenCreate: {
            errors: [],
            token: "test-token",
            refreshToken: "test-refresh",
            user: {
              id: "1",
              email: "admin@example.com",
              firstName: "Admin",
              lastName: "User",
              isStaff: true,
              userPermissions: [
                {
                  code: "MANAGE_USERS",
                  name: "Handle checkouts",
                },
              ],
            },
          },
        },
      }),
    );

    apolloClient.mutate = mutateMock;

    const { result } = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    // Simulate two concurrent login attempts
    result.current.login!("email", "password");
    result.current.login!("email", "password");

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });
});
