import { useApolloClient } from "@apollo/client";
import { useUserDetailsQuery } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { useAuth, useAuthState } from "@saleor/sdk";
import { act, renderHook } from "@testing-library/react-hooks";
import { useIntl } from "react-intl";
import { Mock } from "vitest";

import { useAuthProvider } from "./hooks/useAuthProvider";

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
});

vi.mock("react-intl", () => ({
  useIntl: vi.fn(() => ({
    formatMessage: vi.fn(x => x.defaultMessage),
  })),
  defineMessages: vi.fn(x => x),
}));

vi.mock("@saleor/sdk", () => ({
  useAuth: vi.fn(() => ({
    login: vi.fn(() => ({
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
    logout: vi.fn(),
  })),
  useAuthState: vi.fn(() => undefined),
}));
vi.mock("@apollo/client", () => ({
  useApolloClient: vi.fn(() => ({
    clearStore: vi.fn(),
  })),
  ApolloError: vi.fn(),
}));

vi.mock("@dashboard/graphql", () => ({
  useUserDetailsQuery: vi.fn(() => ({
    data: undefined,
  })),
}));

vi.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: vi.fn(() => () => undefined),
}));

vi.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: vi.fn(() => () => undefined),
}));
vi.mock("@dashboard/hooks/useLocalStorage", () => ({
  __esModule: true,
  default: vi.fn(() => []),
}));
vi.mock("@dashboard/auth", () => ({
  useUser: vi.fn(),
}));
vi.mock("use-react-router", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    location: {},
  })),
}));

describe("AuthProvider", () => {
  it("Staff user will be logged in if has valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuthState as Mock).mockImplementation(() => ({
      authenticated: true,
      authenticating: false,
      user: {
        isStaff: true,
      },
    }));
    (useUserDetailsQuery as Mock).mockImplementation(() => ({
      data: {
        me: {
          email: adminCredentials.email,
          isStaff: true,
        },
      },
    }));

    // Act
    const hook = renderHook(() =>
      useAuthProvider({ intl, notify, apolloClient }),
    );
    await act(async () =>
      hook.result.current.login(
        adminCredentials.email,
        adminCredentials.password,
      ),
    );

    // Assert
    expect(hook.result.current.user?.email).toBe(adminCredentials.email);
    expect(hook.result.current.authenticated).toBe(true);
  });

  it("User will not be logged in if doesn't have valid credentials", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuthState as Mock).mockImplementation(() => ({
      authenticated: false,
      authenticating: false,
    }));
    (useUserDetailsQuery as Mock).mockImplementation(() => ({
      data: {
        me: null,
      },
    }));

    // Act
    const hook = renderHook(() =>
      useAuthProvider({ intl, notify, apolloClient }),
    );

    // Assert
    expect(hook.result.current.user).toBe(null);
    expect(hook.result.current.authenticated).toBe(false);
  });

  it("Non-staff user will not be logged in", async () => {
    // Arrange
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuthState as Mock).mockImplementation(() => ({
      authenticated: false,
      authenticating: false,
    }));
    (useUserDetailsQuery as Mock).mockImplementation(() => ({
      data: {
        me: {
          email: nonStaffUserCredentials.email,
          isStaff: false,
        },
      },
    }));

    // Act
    const hook = renderHook(() =>
      useAuthProvider({ intl, notify, apolloClient }),
    );
    await act(async () =>
      hook.result.current.login(
        nonStaffUserCredentials.email,
        nonStaffUserCredentials.password,
      ),
    );

    // Assert
    expect(hook.result.current.errors).toEqual([]);
    expect(hook.result.current.authenticated).toBe(false);
  });

  it("Should logout user without userPermissions", async () => {
    const intl = useIntl();
    const notify = useNotifier();
    const apolloClient = useApolloClient();

    (useAuth as Mock).mockImplementation(() => ({
      login: vi.fn(() => ({
        data: {
          tokenCreate: {
            errors: [],
            user: {
              userPermissions: [],
            },
          },
        },
      })),
      logout: vi.fn(),
    }));

    // Act
    const hook = renderHook(() =>
      useAuthProvider({ intl, notify, apolloClient }),
    );
    await act(async () =>
      hook.result.current.login(
        nonStaffUserCredentials.email,
        nonStaffUserCredentials.password,
      ),
    );

    // Assert
    expect(hook.result.current.errors).toEqual(["noPermissionsError"]);
    expect(hook.result.current.authenticated).toBe(false);
  });
});
