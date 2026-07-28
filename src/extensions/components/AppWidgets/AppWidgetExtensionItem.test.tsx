import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { render, screen } from "@testing-library/react";

import { AppWidgetExtensionItem } from "./AppWidgetExtensionItem";

jest.mock("@dashboard/extensions/components/IframePost/IframePost", () => ({
  IframePost: () => <div data-test-id="iframe-post" />,
}));

jest.mock("@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame", () => ({
  AppFrame: () => <div data-test-id="app-frame" />,
}));

jest.mock("@dashboard/extensions/components/AppWidgetCard/AppWidgetCard", () => ({
  AppWidgetCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const buildExtension = (overrides: Partial<ExtensionWithParams> = {}): ExtensionWithParams =>
  ({
    id: "ext1",
    app: { id: "app1", name: "App 1", appUrl: "https://example.com", brand: null },
    accessToken: "token1",
    permissions: [],
    label: "Extension 1",
    mountName: "ORDER_DETAILS_WIDGETS",
    url: "https://example.com/ext1",
    open: jest.fn(),
    targetName: "WIDGET",
    settings: {},
    isSaleorOfficial: false,
    fromCache: false,
    ...overrides,
  }) as ExtensionWithParams;

describe("AppWidgetExtensionItem", () => {
  it.each(["APP_PAGE", "NEW_TAB", "POPUP"] as const)(
    "renders the %s text mount inside the widget list padding",
    targetName => {
      // Arrange
      const extension = buildExtension({ targetName });

      // Act
      render(<AppWidgetExtensionItem extension={extension} params={{}} theme="light" />);

      // Assert
      expect(screen.getByTestId("app-widget-text")).toContainElement(
        screen.getByText(targetName === "POPUP" ? `${extension.label}...` : extension.label),
      );
    },
  );

  it("does not mount the widget iframe while fromCache is true", () => {
    // Arrange & Act
    render(
      <AppWidgetExtensionItem
        extension={buildExtension({ fromCache: true })}
        params={{}}
        theme="light"
      />,
    );

    // Assert
    expect(screen.queryByTestId("iframe-post")).not.toBeInTheDocument();
    expect(screen.queryByTestId("app-frame")).not.toBeInTheDocument();
  });

  it("mounts the widget iframe once real data is loaded (fromCache=false)", () => {
    // Arrange & Act
    render(
      <AppWidgetExtensionItem
        extension={buildExtension({ fromCache: false })}
        params={{}}
        theme="light"
      />,
    );

    // Assert
    expect(screen.getByTestId("app-frame")).toBeInTheDocument();
  });
});
