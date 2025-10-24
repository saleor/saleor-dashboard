import { AppManifestFragment, PermissionEnum, useAppInstallMutation } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { extractMutationErrors } from "@dashboard/misc";
import { act, renderHook } from "@testing-library/react-hooks";
import { useIntl } from "react-intl";

import { useInstallApp } from "./useInstallApp";

jest.mock("@dashboard/graphql", () => {
  const actual = jest.requireActual("@dashboard/graphql");

  return {
    ...actual,
    useAppInstallMutation: jest.fn(),
  };
});

jest.mock("@dashboard/hooks/useLocalStorage", () => jest.fn());
jest.mock("@dashboard/hooks/useNavigator", () => jest.fn());
jest.mock("@dashboard/hooks/useNotifier", () => jest.fn());
jest.mock("@dashboard/misc", () => ({
  extractMutationErrors: jest.fn(),
}));
jest.mock("@dashboard/extensions/utils", () => ({
  getAppInstallErrorMessage: jest.fn().mockReturnValue("Test error message"),
}));

describe("useInstallApp", () => {
  const mockGetValues = jest.fn().mockReturnValue("https://example.com/manifest");
  const mockManifest = {
    __typename: "Manifest" as const,
    name: "Test App",
    identifier: "test-app",
    version: "1.0.0",
    about: null,
    permissions: [
      {
        __typename: "Permission" as const,
        code: PermissionEnum.MANAGE_APPS,
        name: "Permission 1",
      },
      {
        __typename: "Permission" as const,
        code: PermissionEnum.MANAGE_ORDERS,
        name: "Permission 2",
      },
    ],
    dataPrivacy: null,
    dataPrivacyUrl: null,
    homepageUrl: null,
    supportUrl: null,
    configurationUrl: null,
    appUrl: null,
    tokenTargetUrl: null,
    brand: null,
    extensions: [],
  } satisfies AppManifestFragment;
  const mockNavigate = jest.fn();
  const mockNotify = jest.fn();
  const mockSetActiveInstallations = jest.fn();
  const mockInstallApp = jest.fn();
  const mockOnCompleted = jest.fn();
  const activeInstallations: Array<Record<"id" | "name", string>> = [];

  // Setup mocks used in each test
  (useNavigator as jest.Mock).mockReturnValue(mockNavigate);
  (useNotifier as jest.Mock).mockReturnValue(mockNotify);
  (useLocalStorage as jest.Mock).mockImplementation(() => [
    activeInstallations,
    (value: any) => {
      if (typeof value === "function") {
        mockSetActiveInstallations(value(activeInstallations));
      } else {
        mockSetActiveInstallations(value);
      }
    },
  ]);
  (useIntl as jest.Mock).mockReturnValue({ formatMessage: jest.fn() });
  (useAppInstallMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
    mockOnCompleted.mockImplementation(onCompleted);

    return [mockInstallApp, { loading: false }];
  });
  (extractMutationErrors as jest.Mock).mockResolvedValue(null);

  it("should return method to submit installation and it's current state", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useInstallApp({
        getValues: mockGetValues,
        manifest: mockManifest,
      }),
    );

    // Assert
    expect(result.current.submitInstallApp).toBeDefined();
    expect(result.current.isSubmittingInstallation).toBe(false);
  });

  it("should make a mutation to install app when called", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useInstallApp({
        getValues: mockGetValues,
        manifest: mockManifest,
      }),
    );

    // Act
    await act(async () => {
      await result.current.submitInstallApp();
    });

    // Assert
    expect(mockInstallApp).toHaveBeenCalledWith({
      variables: {
        input: {
          appName: mockManifest.name,
          manifestUrl: "https://example.com/manifest",
          permissions: [PermissionEnum.MANAGE_APPS, PermissionEnum.MANAGE_ORDERS],
        },
      },
    });
  });

  it("should navigate to previous page when installation is successful", async () => {
    // Arrange
    const mockInstallationData = {
      appInstall: {
        appInstallation: {
          id: "123",
          appName: "Test App",
        },
        errors: [],
      },
    };

    const { result } = renderHook(() =>
      useInstallApp({
        getValues: mockGetValues,
        manifest: mockManifest,
      }),
    );

    // Act
    await act(async () => {
      await result.current.submitInstallApp();
      mockOnCompleted(mockInstallationData);
    });

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(expect.any(String));
  });

  it("should handle installation errors by displaying a notification", async () => {
    // Arrange
    const mockError = {
      code: "INVALID_MANIFEST_FORMAT",
      message: "Invalid manifest format",
      field: null,
      permissions: null,
    };

    const { result } = renderHook(() =>
      useInstallApp({
        getValues: mockGetValues,
        manifest: mockManifest,
      }),
    );

    // Act
    await act(async () => {
      await result.current.submitInstallApp();
      mockOnCompleted({
        appInstall: {
          errors: [mockError],
        },
      });
    });

    // Assert
    expect(mockNotify).toHaveBeenCalledWith({
      status: "error",
      text: "Test error message",
    });
  });

  it("should update active installations in localStorage when installation is successful", async () => {
    // Arrange
    const mockInstallationData = {
      appInstall: {
        appInstallation: {
          id: "123",
          appName: "Test App",
        },
        errors: [],
      },
    };

    const { result } = renderHook(() =>
      useInstallApp({
        getValues: mockGetValues,
        manifest: mockManifest,
      }),
    );

    // Act
    await act(async () => {
      await result.current.submitInstallApp();
      mockOnCompleted(mockInstallationData);
    });

    // Assert
    expect(mockSetActiveInstallations).toHaveBeenCalledWith([
      {
        id: "123",
        name: "Test App",
      },
    ]);
  });
});
