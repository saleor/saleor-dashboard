import { ApolloError } from "@apollo/client";
import { AccountErrorCode } from "@dashboard/graphql";
import { waitFor } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";

import { useAuthProvider } from "./useAuthProvider";

jest.mock("@dashboard/auth/tokenStorage", () => ({
  storage: {
    getRefreshToken: jest.fn(() => null),
    getAuthPluginId: jest.fn(() => null),
    setAccessToken: jest.fn(),
    setTokens: jest.fn(),
    clear: jest.fn(),
  },
}));

jest.mock("@dashboard/utils/credentialsManagement", () => ({
  login: jest.fn(),
  saveCredentials: jest.fn(),
  isSupported: true,
}));

const mockNavigate = jest.fn();

jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const mockNotify = jest.fn();
const mockIntl = {
  formatMessage: jest.fn(message => message.defaultMessage),
};

const createMockApolloClient = (mutateImpl?: jest.Mock) => ({
  clearStore: jest.fn(),
  mutate:
    mutateImpl ??
    jest.fn(() =>
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
              userPermissions: ["MANAGE_ORDERS"],
            },
          },
        },
      }),
    ),
});

describe("useAuthProvider", () => {
  describe("handleLogin", () => {
    it("should handle successful login", async () => {
      // Arrange
      const mockApolloClient = createMockApolloClient();

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
      waitFor(() => {
        expect(mockApolloClient.mutate).toHaveBeenCalledTimes(1);
        expect(mockApolloClient.mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: { email: "admin@example.com", password: "password" },
          }),
        );
      });
    });

    it("should handle login with no permissions", async () => {
      // Arrange
      const mockApolloClient = createMockApolloClient(
        jest.fn(() =>
          Promise.resolve({
            data: {
              tokenCreate: {
                errors: [],
                token: "test-token",
                refreshToken: "test-refresh",
                user: {
                  id: "2",
                  email: "user@example.com",
                  firstName: "User",
                  lastName: "Test",
                  isStaff: false,
                  userPermissions: [],
                },
              },
            },
          }),
        ),
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
        await result.current.login!("user@example.com", "password");
      });

      // Assert
      waitFor(() => {
        expect(result.current.errors).toContain("noPermissionsError");
      });
    });

    it("should handle invalid credentials error", async () => {
      // Arrange
      const mockApolloClient = createMockApolloClient(
        jest.fn(() =>
          Promise.resolve({
            data: {
              tokenCreate: {
                errors: [{ code: AccountErrorCode.INVALID_CREDENTIALS }],
                token: null,
                refreshToken: null,
                user: null,
              },
            },
          }),
        ),
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
        await result.current.login!("wrong@example.com", "wrongpass");
      });

      // Assert
      waitFor(() => {
        expect(result.current.errors).toContain("invalidCredentials");
      });
    });

    it("should handle login attempt delayed error", async () => {
      // Arrange
      const mockApolloClient = createMockApolloClient(
        jest.fn(() =>
          Promise.resolve({
            data: {
              tokenCreate: {
                errors: [{ code: AccountErrorCode.LOGIN_ATTEMPT_DELAYED }],
                token: null,
                refreshToken: null,
                user: null,
              },
            },
          }),
        ),
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
      expect(result.current.errors).toContain("loginAttemptDelay");
    });

    it("should handle Apollo error", async () => {
      // Arrange
      const mockApolloClient = createMockApolloClient(
        jest.fn(() =>
          Promise.reject(
            new ApolloError({
              networkError: new Error("Network error"),
            }),
          ),
        ),
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
      const mockApolloClient = createMockApolloClient(
        jest.fn(() =>
          Promise.resolve({
            data: {
              tokenCreate: {
                errors: [{ code: AccountErrorCode.ACCOUNT_NOT_CONFIRMED }],
                token: null,
                refreshToken: null,
                user: null,
              },
            },
          }),
        ),
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
      expect(result.current.errors).toContain("loginError");
    });
  });
});
