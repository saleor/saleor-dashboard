import { AppErrorCode, PermissionEnum, useAppCreateMutation } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import { UseFormSetError } from "react-hook-form";

import { useHandleCreateAppSubmit } from "./useHandleCreateAppSubmit";

// Mock dependencies
jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as {}),
  useAppCreateMutation: jest.fn(),
  PermissionEnum: {
    MANAGE_APPS: "MANAGE_APPS",
    MANAGE_ORDERS: "MANAGE_ORDERS",
  },
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

const mockNotify = jest.fn();

jest.mock("@dashboard/hooks/useNotifier", () => () => mockNotify);

const mockUseAppCreateMutation = useAppCreateMutation as jest.MockedFunction<
  typeof useAppCreateMutation
>;

describe("useHandleCreateAppSubmit", () => {
  const mockSetToken = jest.fn();
  const mockSetError = jest.fn() as jest.MockedFunction<
    UseFormSetError<{
      permissions: Record<string, boolean>;
      appName: string;
    }>
  >;
  const mockCreateApp = jest.fn();
  const onCompletedCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup the mock implementation
    mockUseAppCreateMutation.mockImplementation(options => {
      if (options) {
        onCompletedCallback.mockImplementation(options.onCompleted);
      }

      return [mockCreateApp, {} as any];
    });
  });

  it("should call createApp mutation with correct input when submitting form", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useHandleCreateAppSubmit({
        setToken: mockSetToken,
        setError: mockSetError,
      }),
    );
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

    // Copy function implementation to trigger it manually
    mockUseAppCreateMutation.mockImplementation(options => {
      if (options && options.onCompleted) {
        onCompletedCallback.mockImplementation(options.onCompleted);
      }

      return [mockCreateApp, {} as any];
    });

    const { result } = renderHook(() =>
      useHandleCreateAppSubmit({
        setToken: mockSetToken,
        setError: mockSetError,
      }),
    );

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

  it("should set error on appName field when name is invalid or duplicate", async () => {
    // Arrange
    const errorMessage = "App with this name already exists";

    const { result } = renderHook(() =>
      useHandleCreateAppSubmit({
        setToken: mockSetToken,
        setError: mockSetError,
      }),
    );
    const formData = {
      appName: "Duplicate App",
      permissions: {
        [PermissionEnum.MANAGE_APPS]: true,
      },
    };

    // Act
    await act(async () => {
      await result.current(formData);
      onCompletedCallback({
        appCreate: {
          errors: [
            {
              code: AppErrorCode.UNIQUE,
              field: "name",
              message: errorMessage,
            },
          ],
          app: null,
          authToken: null,
        },
      });
    });

    // Assert
    expect(mockSetError).toHaveBeenCalledWith("appName", {
      message: errorMessage,
    });
    expect(mockSetToken).not.toHaveBeenCalled();
  });

  it("should set error on permission fields when permission is out of scope", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useHandleCreateAppSubmit({
        setToken: mockSetToken,
        setError: mockSetError,
      }),
    );
    const formData = {
      appName: "Test App",
      permissions: {
        [PermissionEnum.MANAGE_APPS]: true,
        [PermissionEnum.MANAGE_ORDERS]: true,
      },
    };

    // Act
    await act(async () => {
      await result.current(formData);
      onCompletedCallback({
        appCreate: {
          errors: [
            {
              code: AppErrorCode.OUT_OF_SCOPE_PERMISSION,
              field: null,
              message: "You don't have access to these permissions",
              permissions: [PermissionEnum.MANAGE_ORDERS],
            },
          ],
          app: null,
          authToken: null,
        },
      });
    });

    // Assert
    expect(mockSetError).toHaveBeenCalledWith(`permissions.${PermissionEnum.MANAGE_ORDERS}`, {
      message: "You don't have access to this permission",
    });
    expect(mockSetToken).not.toHaveBeenCalled();
  });

  it("should show notification when error is not related to specific field", async () => {
    // Arrange
    const errorMessage = "You don't have permission to perform this action";

    const { result } = renderHook(() =>
      useHandleCreateAppSubmit({
        setToken: mockSetToken,
        setError: mockSetError,
      }),
    );
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
          errors: [
            {
              code: AppErrorCode.FORBIDDEN,
              field: null,
              message: errorMessage,
            },
          ],
          app: null,
          authToken: null,
        },
      });
    });

    // Assert
    expect(mockNotify).toHaveBeenCalledWith({
      status: "error",
      text: errorMessage,
    });
    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockSetToken).not.toHaveBeenCalled();
  });
});
