import {
  CONFIRM_ACCOUNT,
  CONFIRM_EMAIL_CHANGE,
  CREATE_ACCOUNT_ADDRESS,
  DELETE_ACCOUNT,
  DELETE_ACCOUNT_ADDRESS,
  REQUEST_DELETE_ACCOUNT,
  REQUEST_EMAIL_CHANGE,
  SET_ACCOUNT_DEFAULT_ADDRESS,
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_ADDRESS,
} from "../apollo/mutations";
import { auth } from "./auth";
import { user } from "./user";

const mockLogout = jest.fn();

jest.mock("./auth", () => ({
  auth: jest.fn(() => ({
    changePassword: jest.fn(),
    getExternalAccessToken: jest.fn(),
    getExternalAuthUrl: jest.fn(),
    login: jest.fn(),
    logout: mockLogout,
    refreshExternalToken: jest.fn(),
    refreshToken: jest.fn(),
    setPassword: jest.fn(),
    verifyExternalToken: jest.fn(),
    verifyToken: jest.fn(),
  })),
}));

jest.mock("./storage", () => ({
  storage: {
    setTokens: jest.fn(),
    setAccessToken: jest.fn(),
    setAuthPluginId: jest.fn(),
    getAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    getAuthPluginId: jest.fn(),
    clear: jest.fn(),
  },
}));

describe("user", () => {
  const mockMutate = jest.fn();
  const mockClient = {
    mutate: mockMutate,
  } as any;
  const channel = "default-channel";
  const mutationResult = { data: { some: "data" } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate.mockResolvedValue(mutationResult);
  });

  it("initializes auth with the provided client and channel", () => {
    // Arrange & Act
    user({ apolloClient: mockClient, channel });

    // Assert
    expect(auth).toHaveBeenCalledWith({ apolloClient: mockClient });
  });

  describe("accountDelete", () => {
    it("calls DELETE_ACCOUNT mutation and then logs out", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const token = "delete-token-123";

      // Act
      const result = await sdk.accountDelete(token);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: DELETE_ACCOUNT,
        variables: { token },
      });
      expect(mockLogout).toHaveBeenCalled();
      expect(result).toEqual(mutationResult);
    });

    it("calls logout even if mutation succeeds", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });

      // Act
      await sdk.accountDelete("token");

      // Assert
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("accountRequestDeletion", () => {
    it("calls REQUEST_DELETE_ACCOUNT mutation with channel and redirectUrl", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const redirectUrl = "https://example.com/delete";

      // Act
      const result = await sdk.accountRequestDeletion(redirectUrl);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: REQUEST_DELETE_ACCOUNT,
        variables: { channel, redirectUrl },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("confirmEmailChange", () => {
    it("calls CONFIRM_EMAIL_CHANGE mutation with channel and token", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const token = "email-change-token";

      // Act
      const result = await sdk.confirmEmailChange(token);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: CONFIRM_EMAIL_CHANGE,
        variables: { channel, token },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("requestEmailChange", () => {
    it("uses opts.channel when provided", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = {
        newEmail: "new@example.com",
        password: "password123",
        redirectUrl: "https://example.com/confirm",
        channel: "custom-channel",
      };

      // Act
      const result = await sdk.requestEmailChange(opts);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: REQUEST_EMAIL_CHANGE,
        variables: { ...opts, channel: "custom-channel" },
      });
      expect(result).toEqual(mutationResult);
    });

    it("falls back to default channel when opts.channel is not provided", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = {
        newEmail: "new@example.com",
        password: "password123",
        redirectUrl: "https://example.com/confirm",
      };

      // Act
      const result = await sdk.requestEmailChange(opts as any);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: REQUEST_EMAIL_CHANGE,
        variables: { ...opts, channel },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("updateAccount", () => {
    it("calls UPDATE_ACCOUNT mutation with opts", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = { input: { firstName: "John", lastName: "Doe" } };

      // Act
      const result = await sdk.updateAccount(opts);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: UPDATE_ACCOUNT,
        variables: { ...opts },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("setAccountDefaultAddress", () => {
    it("calls SET_ACCOUNT_DEFAULT_ADDRESS mutation with opts", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = { id: "address-id-1", type: "BILLING" };

      // Act
      const result = await sdk.setAccountDefaultAddress(opts as any);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: SET_ACCOUNT_DEFAULT_ADDRESS,
        variables: { ...opts },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("createAccountAddress", () => {
    it("calls CREATE_ACCOUNT_ADDRESS mutation with opts", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = {
        input: {
          city: "New York",
          country: "US",
          streetAddress1: "123 Main St",
        },
      };

      // Act
      const result = await sdk.createAccountAddress(opts as any);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: CREATE_ACCOUNT_ADDRESS,
        variables: { ...opts },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("deleteAccountAddress", () => {
    it("calls DELETE_ACCOUNT_ADDRESS mutation with addressId", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const addressId = "address-id-to-delete";

      // Act
      const result = await sdk.deleteAccountAddress(addressId);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: DELETE_ACCOUNT_ADDRESS,
        variables: { addressId },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("updateAccountAddress", () => {
    it("calls UPDATE_ACCOUNT_ADDRESS mutation with opts", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = {
        addressId: "address-id-1",
        input: { city: "Los Angeles" },
      };

      // Act
      const result = await sdk.updateAccountAddress(opts as any);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: UPDATE_ACCOUNT_ADDRESS,
        variables: { ...opts },
      });
      expect(result).toEqual(mutationResult);
    });
  });

  describe("confirmAccount", () => {
    it("calls CONFIRM_ACCOUNT mutation with opts", async () => {
      // Arrange
      const sdk = user({ apolloClient: mockClient, channel });
      const opts = { email: "user@example.com", token: "confirm-token-123" };

      // Act
      const result = await sdk.confirmAccount(opts);

      // Assert
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: CONFIRM_ACCOUNT,
        variables: { ...opts },
      });
      expect(result).toEqual(mutationResult);
    });
  });
});
