import { type ApolloClient, ApolloError, type NormalizedCacheObject } from "@apollo/client";
import { GraphQLError } from "graphql";

import { type AuthSDK } from "./authSdk";
import { apiUnreachableVar, authStateVar, resetAuthState } from "./authState";
import { initAuth, retryAutologin, showSignIn } from "./initAuth";
import { storage } from "./tokenStorage";

const mockRefreshToken = jest.fn();
const mockRefreshExternalToken = jest.fn();

jest.mock("./authSdk", () => ({
  auth: (): Partial<AuthSDK> => ({
    refreshToken: mockRefreshToken,
    refreshExternalToken: mockRefreshExternalToken,
  }),
}));
jest.mock("@dashboard/graphql/authFetch", () => ({
  registerAuthClient: jest.fn(),
}));
jest.mock("./tokenStorage", () => ({
  createStorage: jest.fn(),
  isInternalToken: (owner: string): boolean => owner === "saleor",
  storage: { getRefreshToken: jest.fn(), clear: jest.fn() },
}));
jest.mock("jwt-decode", () => ({
  __esModule: true,
  default: (): { owner: string } => ({ owner: "saleor" }),
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;
const apolloClient = {} as ApolloClient<NormalizedCacheObject>;
const offline = new ApolloError({ networkError: new TypeError("Failed to fetch") });

/** Lets the autologin loop run up to its next wait. */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};

describe("initAuth autologin", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    resetAuthState();
    apiUnreachableVar(false);
    mockedStorage.getRefreshToken.mockReturnValue("stored-refresh-token");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("retries the startup refresh when the request fails, and keeps waiting for it", async () => {
    // Arrange
    mockRefreshToken.mockRejectedValueOnce(offline).mockResolvedValueOnce({ data: {} });

    // Act
    initAuth(apolloClient);
    await settle();
    jest.advanceTimersByTime(1000);
    await settle();

    // Assert
    expect(mockRefreshToken).toHaveBeenCalledTimes(2);
    expect(mockRefreshToken).toHaveBeenCalledWith(true);
    expect(authStateVar().authenticating).toBe(true);
  });

  it("shows that Saleor can't be reached and keeps the stored session when the refresh keeps failing", async () => {
    // Arrange
    mockRefreshToken.mockRejectedValue(offline);

    // Act
    initAuth(apolloClient);
    await settle();
    jest.advanceTimersByTime(1000);
    await settle();
    jest.advanceTimersByTime(3000);
    await settle();

    // Assert
    expect(mockRefreshToken).toHaveBeenCalledTimes(3);
    expect(authStateVar().authenticating).toBe(false);
    expect(apiUnreachableVar()).toBe(true);
    expect(mockedStorage.clear).not.toHaveBeenCalled();
  });

  it("stops at once when the API answers the refresh with an error", async () => {
    // Arrange
    mockRefreshToken.mockRejectedValue(new ApolloError({ graphQLErrors: [new GraphQLError("x")] }));

    // Act
    initAuth(apolloClient);
    await settle();
    jest.advanceTimersByTime(10000);
    await settle();

    // Assert
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
    expect(authStateVar().authenticating).toBe(false);
    expect(apiUnreachableVar()).toBe(false);
  });

  it("does not retry once another login or logout has replaced the stored session", async () => {
    // Arrange
    mockRefreshToken.mockRejectedValue(offline);

    // Act
    initAuth(apolloClient);
    await settle();
    mockedStorage.getRefreshToken.mockReturnValue(null);
    jest.advanceTimersByTime(1000);
    await settle();

    // Assert
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
  });

  it("does not refresh without a stored session", () => {
    // Arrange
    mockedStorage.getRefreshToken.mockReturnValue(null);

    // Act
    initAuth(apolloClient);

    // Assert
    expect(mockRefreshToken).not.toHaveBeenCalled();
    expect(authStateVar().authenticating).toBe(false);
  });
});

describe("retryAutologin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedStorage.getRefreshToken.mockReturnValue(null);
    initAuth(apolloClient);
    mockedStorage.getRefreshToken.mockReturnValue("stored-refresh-token");
    apiUnreachableVar(true);
  });

  it("leaves the unreachable state once the API answers the refresh", async () => {
    // Arrange
    mockRefreshToken.mockResolvedValueOnce({ data: {} });

    // Act
    await retryAutologin();

    // Assert
    expect(mockRefreshToken).toHaveBeenCalledWith(true);
    expect(apiUnreachableVar()).toBe(false);
  });

  it("stays on the unreachable state while the request still fails", async () => {
    // Arrange
    mockRefreshToken.mockRejectedValueOnce(offline);

    // Act
    await retryAutologin();

    // Assert
    expect(apiUnreachableVar()).toBe(true);
  });

  it("leaves the unreachable state when there is no stored session left", async () => {
    // Arrange
    mockedStorage.getRefreshToken.mockReturnValue(null);

    // Act
    await retryAutologin();

    // Assert
    expect(mockRefreshToken).not.toHaveBeenCalled();
    expect(apiUnreachableVar()).toBe(false);
  });

  it("goes to the sign-in screen on request", () => {
    // Arrange & Act
    showSignIn();

    // Assert
    expect(apiUnreachableVar()).toBe(false);
  });
});
