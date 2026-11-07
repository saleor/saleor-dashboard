import { ApolloError } from "@apollo/client";
import {
  apiUnreachableVar,
  useAnotherAccountChosen,
  useApiUnreachable,
  useAuthState,
} from "@dashboard/auth/authState";
import { AccountErrorCode } from "@dashboard/graphql";
import { login as loginWithCredentialsManagementAPI } from "@dashboard/utils/credentialsManagement";
import { act, renderHook } from "@testing-library/react";

import { useAuthProvider } from "./useAuthProvider";

// Mock dependencies
jest.mock("@dashboard/auth/authState", () => ({
  useAuthState: jest.fn(),
  useApiUnreachable: jest.fn(() => false),
  useAnotherAccountChosen: jest.fn(() => false),
  apiUnreachableVar: jest.fn(),
}));

const mockLogin = jest.fn();

jest.mock("@dashboard/graphql/client", () => ({
  saleorAuth: {
    login: (...args: unknown[]) => mockLogin(...args),
    logout: jest.fn(),
    getExternalAuthUrl: jest.fn(),
    getExternalAccessToken: jest.fn(),
  },
}));

const useAuthStateMock = {
  authenticated: false,
  authenticating: false,
  isStaff: false,
};

jest.mock("@dashboard/utils/credentialsManagement", () => ({
  login: jest.fn(),
  saveCredentials: jest.fn(),
  checkIfCredentialsExist: jest.fn(() => Promise.resolve(false)),
  isSupported: true,
}));

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const mockNotify = jest.fn();
const mockIntl = {
  formatMessage: jest.fn(message => message.defaultMessage),
};
const mockApolloClient = {
  clearStore: jest.fn(),
};

jest.mock("@dashboard/graphql", () => {
  const actualModule = jest.requireActual("@dashboard/graphql");

  return {
    __esModule: true,
    ...actualModule,
    useUserDetailsQuery: jest.fn(() => ({
      data: undefined,
    })),
  };
});

(useAuthState as jest.Mock).mockReturnValue(useAuthStateMock);

const renderAuthProvider = (): void => {
  renderHook(() =>
    useAuthProvider({
      intl: mockIntl as any,
      notify: mockNotify,
      apolloClient: mockApolloClient as any,
    }),
  );
};

describe("useAuthProvider", () => {
  describe("while Saleor can't be reached at startup", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterEach(() => {
      (useApiUnreachable as jest.Mock).mockReturnValue(false);
      (useAuthState as jest.Mock).mockReturnValue(useAuthStateMock);
    });

    it("signs in with the browser's saved password only when Saleor can be reached", () => {
      // Arrange
      (useApiUnreachable as jest.Mock).mockReturnValue(true);
      renderAuthProvider();

      const whileUnreachable = (loginWithCredentialsManagementAPI as jest.Mock).mock.calls.length;

      (useApiUnreachable as jest.Mock).mockReturnValue(false);

      // Act
      renderAuthProvider();

      // Assert
      expect(whileUnreachable).toBe(0);
      expect(loginWithCredentialsManagementAPI).toHaveBeenCalledTimes(1);
    });

    it("doesn't sign in with the saved password after the merchant chose another account", () => {
      // Arrange
      (useAnotherAccountChosen as jest.Mock).mockReturnValue(true);

      // Act
      renderAuthProvider();

      // Assert
      expect(loginWithCredentialsManagementAPI).not.toHaveBeenCalled();
      (useAnotherAccountChosen as jest.Mock).mockReturnValue(false);
    });

    it("leaves the can't-reach-Saleor state once signed in", () => {
      // Arrange
      (useAuthState as jest.Mock).mockReturnValue({ ...useAuthStateMock, authenticated: true });

      // Act
      renderAuthProvider();

      // Assert
      expect(apiUnreachableVar).toHaveBeenCalledWith(false);
    });
  });

  describe("handleLogin", () => {
    it("should handle successful login", async () => {
      // Arrange
      mockLogin.mockResolvedValueOnce({
        data: {
          tokenCreate: {
            errors: [],
            user: {
              email: "admin@example.com",
              userPermissions: ["MANAGE_ORDERS"],
              isStaff: true,
            },
          },
        },
      });

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("admin@example.com", "password");
      });

      // Assert
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "password",
      });
      expect(result.current.errors).toEqual([]);
    });

    it("should handle login with no permissions", async () => {
      // Arrange
      mockLogin.mockResolvedValueOnce({
        data: {
          tokenCreate: {
            errors: [],
            user: {
              email: "user@example.com",
              userPermissions: [],
              isStaff: false,
            },
          },
        },
      });

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("user@example.com", "password");
      });

      // Assert
      expect(result.current.errors).toContain("noPermissionsError");
    });

    it("should handle invalid credentials error", async () => {
      // Arrange
      mockLogin.mockResolvedValueOnce({
        data: {
          tokenCreate: {
            errors: [{ code: AccountErrorCode.INVALID_CREDENTIALS }],
            user: null,
          },
        },
      });

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("wrong@example.com", "wrongpass");
      });

      // Assert
      expect(result.current.errors).toContain("invalidCredentials");
    });

    it("should handle login attempt delayed error", async () => {
      // Arrange
      mockLogin.mockResolvedValueOnce({
        data: {
          tokenCreate: {
            errors: [{ code: AccountErrorCode.LOGIN_ATTEMPT_DELAYED }],
            user: null,
          },
        },
      });

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("test@example.com", "password");
      });

      // Assert
      expect(result.current.errors).toContain("loginAttemptDelay");
    });

    it("should handle Apollo error", async () => {
      // Arrange
      mockLogin.mockRejectedValueOnce(
        new ApolloError({
          networkError: new Error("Network error"),
        }),
      );

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("test@example.com", "password");
      });

      // Assert
      expect(result.current.errors).toContain("unknownLoginError");
    });

    it("should handle other login errors", async () => {
      // Arrange
      mockLogin.mockResolvedValueOnce({
        data: {
          tokenCreate: {
            errors: [{ code: AccountErrorCode.ACCOUNT_NOT_CONFIRMED }],
            user: null,
          },
        },
      });

      // Act
      const { result } = renderHook(() =>
        useAuthProvider({
          intl: mockIntl as any,
          notify: mockNotify,
          apolloClient: mockApolloClient as any,
        }),
      );

      await act(async () => {
        await result.current.login!("test@example.com", "password");
      });

      // Assert
      expect(result.current.errors).toContain("loginError");
    });
  });
});
