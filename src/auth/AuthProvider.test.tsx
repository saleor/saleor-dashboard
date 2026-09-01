import { useApolloClient } from "@apollo/client";
import { useAuthState } from "@dashboard/auth/authState";
import { useUserDetailsQuery } from "@dashboard/graphql";
import { saleorAuth } from "@dashboard/graphql/client";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { act, renderHook } from "@testing-library/react";
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
jest.mock("@dashboard/auth/authState", () => ({
  useAuthState: jest.fn(() => ({
    authenticated: false,
    authenticating: false,
    isStaff: false,
  })),
}));
jest.mock("@dashboard/graphql/client", () => ({
  saleorAuth: {
    login: jest.fn(() => ({
      data: {
        tokenCreate: {
          errors: [],
          user: {
            userPermissions: [
              {
                code: "MANAGE_USERS",
                name: "Handle checkouts",
              },
            ],
          },
        },
      },
    })),
    logout: jest.fn(),
    getExternalAuthUrl: jest.fn(),
    getExternalAccessToken: jest.fn(),
  },
}));
jest.mock("@apollo/client", () => ({
  useApolloClient: jest.fn(() => ({
    clearStore: jest.fn(),
  })),
  ApolloError: jest.fn(),
}));
jest.mock("@dashboard/graphql", () => ({
  useUserDetailsQuery: jest.fn(() => ({
    data: undefined,
  })),
}));
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
describe("AuthProvider", () => {
  it("Staff user will be logged in if has valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuthState as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      authenticating: false,
      isStaff: true,
    }));
    (useUserDetailsQuery as jest.Mock).mockImplementation(() => ({
      data: {
        me: {
          email: adminCredentials.email,
          isStaff: true,
        },
      },
    }));

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    await act(async () => {
      hook.result.current.login!(adminCredentials.email, adminCredentials.password);
    });
    // Assert
    expect(hook.result.current.user?.email).toBe(adminCredentials.email);
    expect(hook.result.current.authenticated).toBe(true);
  });
  it("User will not be logged in if doesn't have valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuthState as jest.Mock).mockImplementation(() => ({
      authenticated: false,
      authenticating: false,
      isStaff: false,
    }));
    (useUserDetailsQuery as jest.Mock).mockImplementation(() => ({
      data: {
        me: null,
      },
    }));

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
    const apolloClient = useApolloClient();

    (useAuthState as jest.Mock).mockImplementation(() => ({
      authenticated: false,
      authenticating: false,
      isStaff: false,
    }));
    (useUserDetailsQuery as jest.Mock).mockImplementation(() => ({
      data: {
        me: {
          email: nonStaffUserCredentials.email,
          isStaff: false,
        },
      },
    }));

    // Act
    const hook = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    await act(async () => {
      hook.result.current.login!(nonStaffUserCredentials.email, nonStaffUserCredentials.password);
    });
    // Assert
    expect(hook.result.current.errors).toEqual([]);
    expect(hook.result.current.authenticated).toBe(false);
  });
  it("Should logout user without userPermissions", async () => {
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (saleorAuth.login as jest.Mock).mockImplementation(() => ({
      data: {
        tokenCreate: {
          errors: [],
          user: {
            userPermissions: [],
          },
        },
      },
    }));

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
    const apolloClient = useApolloClient();

    (useAuthState as jest.Mock).mockImplementation(() => ({
      authenticated: false,
      authenticating: false,
      isStaff: false,
    }));

    let resolveLogin: (value: any) => void;
    const loginMock = jest.fn(
      () =>
        new Promise(resolve => {
          resolveLogin = resolve;
        }),
    );

    (saleorAuth.login as jest.Mock).mockImplementation(loginMock);

    const { result } = renderHook(() => useAuthProvider({ intl, notify, apolloClient }));

    // Start first login (will be pending)
    act(() => {
      result.current.login!("email", "password");
    });

    // Attempt second login while first is still in progress
    act(() => {
      result.current.login!("email", "password");
    });

    // Resolve the first login
    await act(async () => {
      resolveLogin!({
        data: {
          tokenCreate: {
            errors: [],
            user: {
              userPermissions: [
                {
                  code: "MANAGE_USERS",
                  name: "Handle checkouts",
                },
              ],
            },
          },
        },
      });
    });

    expect(loginMock).toHaveBeenCalledTimes(1);
  });
});
