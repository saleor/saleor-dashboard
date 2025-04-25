import { PermissionEnum, useAppCreateMutation } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";

import { useHandleCreateAppSubmit } from "./useHandleCreateAppSubmit";

// Mock dependencies
jest.mock("@dashboard/graphql", () => ({
  useAppCreateMutation: jest.fn(),
  PermissionEnum: {
    MANAGE_APPS: "MANAGE_APPS",
    MANAGE_ORDERS: "MANAGE_ORDERS",
  },
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());
jest.mock("@dashboard/hooks/useNotifier", () => () => jest.fn());
jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(messages => messages),
}));

const mockUseAppCreateMutation = useAppCreateMutation as jest.MockedFunction<
  typeof useAppCreateMutation
>;

describe("useHandleCreateAppSubmit", () => {
  const mockSetToken = jest.fn();
  const mockCreateApp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call createApp mutation with correct input when submitting form", async () => {
    // Arrange
    mockUseAppCreateMutation.mockReturnValue([mockCreateApp, {} as any]);

    const { result } = renderHook(() => useHandleCreateAppSubmit({ setToken: mockSetToken }));
    const formData = {
      appName: "Test App",
      permissions: {
        [PermissionEnum.MANAGE_APPS]: true,
        [PermissionEnum.MANAGE_ORDERS]: false,
      },
    };

    // Act
    await act(async () => {
      await result.current(formData);
    });

    // Assert
    expect(mockCreateApp).toHaveBeenCalledWith({
      variables: {
        input: {
          name: "Test App",
          permissions: [PermissionEnum.MANAGE_APPS],
        },
      },
    });
  });

  it("should handle successful app creation", async () => {
    // Arrange
    const mockAppId = "app-123";
    const mockAuthToken = "auth-token-123";
    const onCompletedCallback = jest.fn();

    // Copy function implementation to trigger it manually
    mockUseAppCreateMutation.mockImplementation(options => {
      if (options && options.onCompleted) {
        onCompletedCallback.mockImplementation(options.onCompleted);
      }

      return [mockCreateApp, {} as any];
    });

    const { result } = renderHook(() => useHandleCreateAppSubmit({ setToken: mockSetToken }));
    const formData = {
      appName: "Test App",
      permissions: {
        [PermissionEnum.MANAGE_APPS]: true,
      },
    };

    // Act
    await act(async () => {
      await result.current(formData);
      onCompletedCallback({
        appCreate: {
          errors: [],
          app: {
            id: mockAppId,
          },
          authToken: mockAuthToken,
        },
      });
    });

    // Assert
    expect(mockSetToken).toHaveBeenCalledWith(mockAuthToken);
  });
});
