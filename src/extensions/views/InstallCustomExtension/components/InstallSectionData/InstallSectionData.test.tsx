import { render, screen } from "@testing-library/react";
import { type Control, useWatch } from "react-hook-form";

import { type useInstallChecks } from "../../hooks/useInstallChecks";
import { type ExtensionInstallFormData, type Manifest } from "../../types";
import { InstallExtensionManifestData } from "./InstallExtensionManifestData/InstallExtensionManifestData";
import { InstallSectionData } from "./InstallSectionData";

jest.mock("./InstallExtensionManifestData/InstallExtensionManifestData", () => ({
  InstallExtensionManifestData: jest.fn(() => <div>Mock Manifest Data</div>),
}));

jest.mock("react-hook-form", () => ({
  useWatch: jest.fn(),
}));

describe("InstallSectionData", () => {
  const mockControl = {} as Control<ExtensionInstallFormData>;
  const mockManifest: Manifest = {
    __typename: "Manifest",
    identifier: "test.extension",
    version: "1.0.0",
    name: "Test Extension",
    about: null,
    author: null,
    appUrl: null,
    tokenTargetUrl: null,
    dataPrivacy: null,
    dataPrivacyUrl: "https://example.com/privacy",
    deprecationReason: null,
    homepageUrl: null,
    supportUrl: null,
    requiredSaleorVersion: null,
    permissions: [],
    extensions: [],
    webhooks: [],
    brand: {
      __typename: "AppManifestBrand",
      logo: {
        __typename: "AppManifestBrandLogo",
        default: "https://example.com/logo.png",
      },
    },
  };
  const checks: ReturnType<typeof useInstallChecks> = {
    issues: undefined,
    isOfficial: false,
    deprecation: { acknowledged: true, setAcknowledged: jest.fn() },
    trust: { acknowledged: false, setAcknowledged: jest.fn() },
    canInstall: false,
  };

  it("displays skeleton loading state when isFetchingManifest is true", () => {
    // Arrange
    (useWatch as jest.Mock).mockReturnValue("https://example.com/manifest.json");

    const { container } = render(
      <InstallSectionData
        isFetchingManifest={true}
        manifest={undefined}
        lastFetchedManifestUrl={undefined}
        control={mockControl}
        checks={checks}
      />,
    );

    // Assert
    const skeletons = container.querySelectorAll('[data-macaw-ui-component="Skeleton"]');

    expect(skeletons).toHaveLength(7);
  });

  it("displays manifest data when manifest exists and lastFetchedManifestUrl matches form value", () => {
    // Arrange
    const manifestUrl = "https://example.com/manifest.json";

    (useWatch as jest.Mock).mockReturnValue(manifestUrl);

    render(
      <InstallSectionData
        isFetchingManifest={false}
        manifest={mockManifest}
        lastFetchedManifestUrl={manifestUrl}
        control={mockControl}
        checks={checks}
      />,
    );

    // Assert
    expect(screen.getByText("Mock Manifest Data")).toBeInTheDocument();
    expect(InstallExtensionManifestData).toHaveBeenCalledWith(
      expect.objectContaining({ manifest: mockManifest, manifestUrl, checks }),
      expect.anything(),
    );
  });

  it("returns null when manifest exists but lastFetchedManifestUrl does not match form value", () => {
    // Arrange
    (useWatch as jest.Mock).mockReturnValue("https://example.com/manifest.json");

    const { container } = render(
      <InstallSectionData
        isFetchingManifest={false}
        manifest={mockManifest}
        lastFetchedManifestUrl="https://different-url.com/manifest.json"
        control={mockControl}
        checks={checks}
      />,
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("returns null when manifest doesn't exist and it's not being fetched", () => {
    // Arrange
    (useWatch as jest.Mock).mockReturnValue("https://example.com/manifest.json");

    const { container } = render(
      <InstallSectionData
        isFetchingManifest={false}
        manifest={undefined}
        lastFetchedManifestUrl={undefined}
        control={mockControl}
        checks={checks}
      />,
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
