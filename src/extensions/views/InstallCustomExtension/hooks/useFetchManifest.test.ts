import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
import { AppErrorCode, useAppFetchMutation } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useFetchManifest } from "./useFetchManifest";

jest.mock("@dashboard/graphql", () => {
  const originalModule = jest.requireActual("@dashboard/graphql");

  return {
    ...originalModule,
    useAppFetchMutation: jest.fn(),
  };
});

jest.mock("@dashboard/extensions/utils", () => ({
  getAppInstallErrorMessage: jest.fn(),
}));

describe("useFetchManifest", () => {
  const mockGetValues = jest.fn();
  const mockSetError = jest.fn();
  const mockFetchManifest = jest.fn();
  const mockOnCompleted = jest.fn();

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
      }),
    );

    // Assert
    expect(result.current.manifest).toBeUndefined();
    expect(result.current.lastFetchedManifestUrl).toBeUndefined();
    expect(result.current.isFetchingManifest).toBe(false);
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

    (useAppFetchMutation as jest.Mock).mockReturnValueOnce([
      mockFetchManifest,
      {
        loading: false,
        data: null,
      },
    ]);

    const { result, rerender } = renderHook(() =>
      useFetchManifest({
        getValues: mockGetValues,
        setError: mockSetError,
      }),
    );

    // Act
    await act(async () => {
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
      rerender();
    });

    // Assert
    expect(result.current.manifest).toStrictEqual(mockedManifestValue);
  });

  it("should update lastFetchedManifestUrl when fetch is completed successfully", async () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";

    mockGetValues.mockReturnValue(manifestUrl);

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
      }),
    );

    // Act
    await act(async () => {
      result.current.submitFetchManifest({ manifestUrl });
      // This would be normally called by apollo-client
      mockOnCompleted({
        appFetchManifest: {
          manifest: { name: "Test App" },
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
});
