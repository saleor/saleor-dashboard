import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
import { AppErrorCode, AppTypeEnum, useAppFetchMutation } from "@dashboard/graphql";
import { PULSE_MANIFEST_URL } from "@dashboard/home/getPulsePromotionLink";
import { act, renderHook } from "@testing-library/react";

import { useFetchManifest } from "./useFetchManifest";

const PULSE_IDENTIFIER = "saleor.pulse";

const pulseInstalledAppNode = {
  id: "pulse-app-id",
  identifier: PULSE_IDENTIFIER,
  name: "Saleor Pulse",
  manifestUrl: PULSE_MANIFEST_URL,
  type: AppTypeEnum.THIRDPARTY,
  isActive: true,
  appUrl: "https://pulse.saleor.app",
};

const saleorUniqueError = {
  field: "identifier",
  code: AppErrorCode.UNIQUE,
  message: "App with the same identifier is already installed: Saleor Pulse",
};

jest.mock("@dashboard/graphql", () => {
  const originalModule = jest.requireActual("@dashboard/graphql");

  return {
    ...originalModule,
    useAppFetchMutation: jest.fn(),
    useInstalledAppsQuery: jest.fn(() => ({
      data: {
        apps: {
          edges: [
            {
              node: pulseInstalledAppNode,
            },
          ],
        },
      },
      loading: false,
    })),
  };
});

jest.mock("@dashboard/extensions/utils", () => ({
  getAppInstallErrorMessage: jest.fn(),
}));

describe("useFetchManifest", () => {
  const mockGetValues = jest.fn();
  const mockSetError = jest.fn();
  const mockClearErrors = jest.fn();
  const mockFetchManifest = jest.fn();
  const mockOnCompleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default values", () => {
    // Arrange
    (useAppFetchMutation as jest.Mock).mockReturnValue([
      mockFetchManifest,
      {
        loading: false,
        data: null,
      },
    ]);

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Assert
    expect(result.current.manifest).toBeUndefined();
    expect(result.current.lastFetchedManifestUrl).toBeUndefined();
    expect(result.current.isFetchingManifest).toBe(false);
    expect(result.current.alreadyInstalledApp).toBeNull();
  });

  it("should call fetchManifest with form data when submitFetchManifest is called", () => {
    // Arrange
    (useAppFetchMutation as jest.Mock).mockReturnValue([
      mockFetchManifest,
      {
        loading: false,
        data: null,
      },
    ]);

    const formData = { manifestUrl: "https://example.com/manifest.json" };
    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    result.current.submitFetchManifest(formData);

    // Assert
    expect(mockFetchManifest).toHaveBeenCalledWith({
      variables: formData,
    });
  });

  it("should return manifest value after it was fetched", async () => {
    // Arrange
    const mockedManifestValue = {
      name: "test",
    };

    (useAppFetchMutation as jest.Mock).mockReturnValue([
      mockFetchManifest,
      {
        loading: false,
        data: {
          appFetchManifest: {
            manifest: mockedManifestValue,
            errors: [],
          },
        },
      },
    ]);

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Assert
    expect(result.current.manifest).toEqual(mockedManifestValue);
  });

  it("should set lastFetchedManifestUrl after manifest is fetched", async () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";

    mockGetValues.mockReturnValue(manifestUrl);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl });
      mockOnCompleted({
        appFetchManifest: {
          manifest: { name: "test" },
          errors: [],
        },
      });
    });

    // Assert
    expect(result.current.lastFetchedManifestUrl).toBe(manifestUrl);
  });

  it("should set form error when fetch returns errors", async () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";
    const errorMessage = "Actual backend error";

    mockGetValues.mockReturnValue(manifestUrl);
    (getAppInstallErrorMessage as jest.Mock).mockReturnValue(errorMessage);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted); // set implementation from our source

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl });
      // This would be normally called by apollo-client
      mockOnCompleted({
        appFetchManifest: {
          manifest: null,
          errors: [{ code: AppErrorCode.INVALID_MANIFEST_FORMAT, message: errorMessage }],
        },
      });
    });

    // Assert
    expect(mockSetError).toHaveBeenCalledWith("manifestUrl", {
      message: errorMessage,
      type: AppErrorCode.INVALID_MANIFEST_FORMAT,
    });
  });

  it("should set form error based on the first GraphQL error when multiple errors are returned", async () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";
    const errorMessages = [
      { code: AppErrorCode.INVALID_MANIFEST_FORMAT, message: "First error" },
      { code: AppErrorCode.INVALID_PERMISSION, message: "Second error" },
    ];

    mockGetValues.mockReturnValue(manifestUrl);
    (getAppInstallErrorMessage as jest.Mock)
      .mockReturnValueOnce(errorMessages[0].message)
      .mockReturnValueOnce(errorMessages[1].message);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl });
      mockOnCompleted({
        appFetchManifest: {
          manifest: null,
          errors: errorMessages,
        },
      });
    });

    // Assert
    expect(mockSetError).toHaveBeenCalledWith("manifestUrl", {
      message: errorMessages[0].message,
      type: errorMessages[0].code,
    });
  });

  it("returns an already-installed app when the manifest identifier matches an installed app", async () => {
    // Arrange
    const alternateManifestUrl = "https://staging.pulse.saleor.app/api/manifest";

    mockGetValues.mockReturnValue(alternateManifestUrl);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl: alternateManifestUrl });
      mockOnCompleted({
        appFetchManifest: {
          manifest: { identifier: PULSE_IDENTIFIER },
          errors: [saleorUniqueError],
        },
      });
    });

    // Assert
    expect(result.current.alreadyInstalledApp).toEqual({
      name: "Saleor Pulse",
      href: ExtensionsUrls.resolveViewManifestExtensionUrl("pulse-app-id"),
      isActive: true,
      linkTarget: "app",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("manifestUrl");
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("returns an already-installed app from Saleor's UNIQUE error message", async () => {
    // Arrange
    const alternateManifestUrl = "https://staging.pulse.saleor.app/api/manifest";

    mockGetValues.mockReturnValue(alternateManifestUrl);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl: alternateManifestUrl });
      mockOnCompleted({
        appFetchManifest: {
          manifest: null,
          errors: [saleorUniqueError],
        },
      });
    });

    // Assert
    expect(result.current.alreadyInstalledApp).toEqual({
      name: "Saleor Pulse",
      href: ExtensionsUrls.resolveViewManifestExtensionUrl("pulse-app-id"),
      isActive: true,
      linkTarget: "app",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("manifestUrl");
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("returns an already-installed app when the manifest URL matches an installed app", async () => {
    // Arrange
    mockGetValues.mockReturnValue(PULSE_MANIFEST_URL);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl: PULSE_MANIFEST_URL });
      mockOnCompleted({
        appFetchManifest: {
          manifest: null,
          errors: [saleorUniqueError],
        },
      });
    });

    // Assert
    expect(result.current.alreadyInstalledApp).toEqual({
      name: "Saleor Pulse",
      href: ExtensionsUrls.resolveViewManifestExtensionUrl("pulse-app-id"),
      isActive: true,
      linkTarget: "app",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("manifestUrl");
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("resolves already-installed app after installed apps finish loading", async () => {
    // Arrange
    const { useInstalledAppsQuery } = jest.requireMock("@dashboard/graphql");
    let installedAppsLoading = true;

    useInstalledAppsQuery.mockImplementation(() => ({
      data: installedAppsLoading
        ? undefined
        : {
            apps: {
              edges: [
                {
                  node: pulseInstalledAppNode,
                },
              ],
            },
          },
      loading: installedAppsLoading,
    }));

    mockGetValues.mockReturnValue(PULSE_MANIFEST_URL);

    (useAppFetchMutation as jest.Mock).mockImplementation(({ onCompleted }) => {
      mockOnCompleted.mockImplementation(onCompleted);

      return [
        mockFetchManifest,
        {
          loading: false,
          data: null,
        },
      ];
    });

    const { result, rerender } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
        clearErrors: mockClearErrors,
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl: PULSE_MANIFEST_URL });
      mockOnCompleted({
        appFetchManifest: {
          manifest: null,
          errors: [saleorUniqueError],
        },
      });
    });

    expect(result.current.alreadyInstalledApp).toBeNull();
    expect(mockSetError).not.toHaveBeenCalled();

    installedAppsLoading = false;
    useInstalledAppsQuery.mockImplementation(() => ({
      data: {
        apps: {
          edges: [
            {
              node: pulseInstalledAppNode,
            },
          ],
        },
      },
      loading: false,
    }));

    await act(async () => {
      rerender();
    });

    // Assert
    expect(result.current.alreadyInstalledApp).toEqual({
      name: "Saleor Pulse",
      href: ExtensionsUrls.resolveViewManifestExtensionUrl("pulse-app-id"),
      isActive: true,
      linkTarget: "app",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("manifestUrl");
  });
});
