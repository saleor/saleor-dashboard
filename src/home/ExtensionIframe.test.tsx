import { type Extension } from "@dashboard/extensions/types";
import { render, screen } from "@testing-library/react";

import { ExtensionIframe } from "./ExtensionIframe";

jest.mock("@dashboard/extensions/components/IframePost/IframePost", () => ({
  IframePost: () => <div data-test-id="iframe-post" />,
}));

jest.mock("@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame", () => ({
  AppFrame: () => <div data-test-id="app-frame" />,
}));

const buildExtension = (overrides: Partial<Extension> = {}): Extension =>
  ({
    id: "ext1",
    app: { id: "app1", name: "App 1", appUrl: "https://example.com", brand: null },
    accessToken: "token1",
    permissions: [],
    label: "Extension 1",
    mountName: "HOMEPAGE_WIDGETS",
    url: "https://example.com/ext1",
    open: jest.fn(),
    targetName: "WIDGET",
    settings: {},
    isSaleorOfficial: false,
    fromCache: false,
    ...overrides,
  }) as Extension;

describe("ExtensionIframe", () => {
  it("does not mount the POST iframe while fromCache is true", () => {
    // Arrange & Act
    render(<ExtensionIframe extension={buildExtension({ fromCache: true })} height="100%" />);

    // Assert
    expect(screen.queryByTestId("iframe-post")).not.toBeInTheDocument();
    expect(screen.queryByTestId("app-frame")).not.toBeInTheDocument();
  });

  it("mounts the POST iframe once real data is loaded (fromCache=false)", () => {
    // Arrange & Act
    render(<ExtensionIframe extension={buildExtension({ fromCache: false })} height="100%" />);

    // Assert
    expect(screen.getByTestId("iframe-post")).toBeInTheDocument();
  });
});
