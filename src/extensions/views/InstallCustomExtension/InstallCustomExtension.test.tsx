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
  FormattedMessage: jest.fn(({ defaultMessage }) => defaultMessage || ""),
  defineMessages: jest.fn(x => x),
}));

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ children }) => <div>{children}</div>),
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

  it("initializes form with manifest URL from query params", () => {
    // Arrange
    const params = {
      [MANIFEST_ATTR]: manifestUrl,
    };

    render(<InstallCustomExtension params={params} />);

    // Assert
    expect(mockUseFetchManifest).toHaveBeenCalledWith(
      expect.objectContaining({
        getValues: expect.any(Function),
        setError: expect.any(Function),
      }),
    );
  });

  it("triggers immediate submission on URL paste", async () => {
    // Arrange
    const params = {};
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

  it("disables install button until manifest is loaded", () => {
    // Arrange
    const params = {};

    render(<InstallCustomExtension params={params} />);

    // Assert
    const installButton = screen.getByRole("button", { name: /save/i }); // note: it's called "save" due to Savebar mock

    expect(installButton).toBeDisabled();
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

  it("auto-submits when mounted with valid manifest param", async () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";
    const params = {
      [MANIFEST_ATTR]: manifestUrl,
    };

    render(<InstallCustomExtension params={params} />);

    // Assert
    await waitFor(() => {
      expect(mockFetchManifestFn).toHaveBeenCalledWith({ manifestUrl }, undefined);
    });
  });
});
