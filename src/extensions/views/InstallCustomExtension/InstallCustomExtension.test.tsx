import { MANIFEST_ATTR } from "@dashboard/extensions/urls";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { useFetchManifest } from "./hooks/useFetchManifest";
import { useInstallApp } from "./hooks/useInstallApp";
import { InstallCustomExtension } from "./InstallCustomExtension";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(({ defaultMessage }) => defaultMessage || ""),
  })),
  FormattedMessage: jest.fn(({ defaultMessage, values }) => {
    // Mock heading to check if we pass correctly extensionName
    if (values?.extensionName) {
      return `Install ${values.extensionName}`;
    }

    return defaultMessage || "";
  }),
  defineMessages: (messages: Record<string, any>) => messages,
}));

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock("@dashboard/theme/hook", () => ({
  useTheme: () => ({ theme: "defaultLight", setTheme: jest.fn() }),
}));

jest.mock("./hooks/useFetchManifest");
jest.mock("./hooks/useInstallApp");
jest.mock("@dashboard/components/Savebar");

jest.useFakeTimers();

describe("InstallCustomExtension", () => {
  const manifestUrl = "https://example.com/manifest.json";

  const mockUseFetchManifest = useFetchManifest as jest.Mock;
  const mockUseInstallApp = useInstallApp as jest.Mock;
  const mockFetchManifestFn = jest.fn();

  beforeEach(() => {
    mockFetchManifestFn.mockClear();
    mockUseFetchManifest.mockReturnValue({
      submitFetchManifest: mockFetchManifestFn,
      manifest: null,
      lastFetchedManifestUrl: undefined,
      isFetchingManifest: false,
    });

    mockUseInstallApp.mockReturnValue({
      submitInstallApp: jest.fn(),
      isSubmittingInstallation: false,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("initializes useForm and useFetchManifest correctly", async () => {
    // Arrange
    const params = {
      [MANIFEST_ATTR]: manifestUrl,
    };

    // Act: Render the component and wait for async effects triggered on mount to complete.
    // This is necessary because the component fetches data and performs other async
    // operations in useEffect
    await act(async () => {
      render(<InstallCustomExtension params={params} />);
    });

    // Assert
    expect(mockUseFetchManifest).toHaveBeenCalledWith(
      expect.objectContaining({
        getValues: expect.any(Function),
        setError: expect.any(Function),
      }),
    );
  });

  it("disables install button until manifest is loaded", () => {
    // Arrange
    const params = {};

    render(<InstallCustomExtension params={params} />);

    // Assert
    const installButton = screen.getByRole("button", { name: "save" }); // different name due to Savebar mock overriding name

    expect(installButton).toBeDisabled();
  });

  describe("when manifest URL is NOT in query params (renders form)", () => {
    const params = {};

    it("renders manifest URL input field", () => {
      // Arrange
      render(<InstallCustomExtension params={params} />);

      // Assert
      expect(screen.getByLabelText(/Provide Manifest URL/i)).toBeInTheDocument();
    });

    it("triggers immediate submission on URL paste", async () => {
      // Arrange
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<InstallCustomExtension params={params} />);

      // Act
      const input = screen.getByLabelText(/Provide Manifest URL/i);

      await user.click(input);
      await user.paste(manifestUrl);

      act(() => {
        jest.advanceTimersByTime(10);
      });

      // Assert
      await waitFor(() => {
        // Paste flushes debounce to happen immediately
        expect(mockFetchManifestFn).toHaveBeenCalled();
      });
    });

    it("shows form errors from manifest fetch", async () => {
      // Arrange
      const errorMessage = "Invalid manifest";
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      mockUseFetchManifest.mockImplementation(({ setError }) => {
        return {
          manifest: null,
          submitFetchManifest: () => setError("manifestUrl", { message: errorMessage }),
          lastFetchedManifestUrl: undefined,
          isFetchingManifest: false,
        };
      });

      render(<InstallCustomExtension params={{}} />);

      // Act - submit form
      const input = screen.getByLabelText(/Provide Manifest URL/i);

      await user.click(input);
      await user.type(input, manifestUrl);

      act(() => {
        jest.advanceTimersByTime(1000); // Wait until debounce submits form
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it("shows app details after manifest fetch", async () => {
      // Arrange
      const mockManifest = {
        id: "app-id",
        name: "Test App",
        version: "1.0.0",
        permissions: [],
      };
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const manifestState: { manifest: typeof mockManifest | null } = { manifest: null };

      mockUseFetchManifest.mockImplementation(() => ({
        submitFetchManifest: () => {
          manifestState.manifest = mockManifest;
        },
        get manifest() {
          return manifestState.manifest;
        },
        lastFetchedManifestUrl: manifestState.manifest ? manifestUrl : undefined,
        isFetchingManifest: false,
      }));

      render(<InstallCustomExtension params={{}} />);

      // Act
      const input = screen.getByLabelText(/Provide Manifest URL/i);

      await user.type(input, manifestUrl);
      act(() => {
        jest.advanceTimersByTime(1000); // Wait for debounce
      });

      // Assert
      await waitFor(() => {
        expect(screen.getAllByText(`Install ${mockManifest.name}`).length).toBeGreaterThan(0);
      });
    });
  });

  describe("when manifest URL IS in query params (renders direct info)", () => {
    const params = {
      [MANIFEST_ATTR]: manifestUrl,
    };

    it("does not render manifest URL input field", async () => {
      // Arrange
      await act(async () => {
        render(<InstallCustomExtension params={params} />);
      });

      // Assert
      expect(screen.queryByLabelText(/Provide Manifest URL/i)).not.toBeInTheDocument();
    });

    it("auto-submits when mounted with valid manifest param", async () => {
      // Arrange
      await act(async () => {
        render(<InstallCustomExtension params={params} />);
      });

      // Assert
      await waitFor(() => {
        expect(mockFetchManifestFn).toHaveBeenCalledWith({ manifestUrl }, undefined);
      });
    });

    it("renders loading state when fetching manifest directly", async () => {
      // Arrange

      mockUseFetchManifest.mockReturnValue({
        submitFetchManifest: mockFetchManifestFn,
        manifest: null,
        lastFetchedManifestUrl: manifestUrl,
        isFetchingManifest: true,
      });

      await act(async () => {
        render(<InstallCustomExtension params={params} />);
      });

      // Assert
      await waitFor(() => {
        const skeletonElements = document.querySelectorAll('[data-macaw-ui-component="Skeleton"]');

        expect(skeletonElements.length).toBeGreaterThan(0);
      });
    });

    it("shows app details immediately after direct manifest fetch", async () => {
      // Arrange
      const mockManifest = {
        id: "app-id",
        name: "Test App",
        version: "1.0.0",
        permissions: [],
        brand: { logo: { default: null } },
      };

      mockUseFetchManifest.mockReturnValue({
        submitFetchManifest: mockFetchManifestFn,
        manifest: mockManifest,
        lastFetchedManifestUrl: manifestUrl,
        isFetchingManifest: false,
      });

      await act(async () => {
        render(<InstallCustomExtension params={params} />);
      });

      // Assert
      await waitFor(() => {
        expect(screen.getAllByText(`Install ${mockManifest.name}`).length).toBeGreaterThan(0);
      });
    });

    it("shows fetch error when manifest URL from param is invalid", async () => {
      // Arrange
      const errorMessage = "Invalid manifest URL";
      const params = {
        [MANIFEST_ATTR]: "invalid-url",
      };

      mockUseFetchManifest.mockImplementation(({ setError }) => {
        // Call setError directly during the render to simulate error from auto-fetch
        setTimeout(() => {
          setError("manifestUrl", { message: errorMessage });
        }, 0);

        return {
          submitFetchManifest: mockFetchManifestFn,
          manifest: null,
          lastFetchedManifestUrl: "invalid-url",
          isFetchingManifest: false,
        };
      });

      await act(async () => {
        render(<InstallCustomExtension params={params} />);
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
});
