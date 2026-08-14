import { type Extension } from "@dashboard/extensions/types";
import { act, render, renderHook, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import type React from "react";
import { MemoryRouter, Route, Router } from "react-router-dom";

import { HomePage, useHomeRouteParams } from "./HomePage";
import { HomeTabPanels } from "./HomeTabPanels";
import { homeWidgetsUrl, homeWidgetUrl } from "./urls";

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensionsWithLoadingState: jest.fn(),
}));

jest.mock("@dashboard/auth/useUser", () => ({
  useUser: () => ({
    user: { firstName: "Ada", email: "ada@example.com", userPermissions: [] },
  }),
}));

jest.mock("./HomeWidgetTabs", () => ({
  HomeWidgetTabs: () => <div data-test-id="home-widget-tabs" />,
}));

jest.mock("./HomeWidgetView", () => ({
  HomeWidgetView: ({ extension }: { extension: { id: string } }) => (
    <div data-test-id={`home-widget-view-${extension.id}`} />
  ),
}));

jest.mock("./HomeWidgetsGrid", () => ({
  HomeWidgetsGrid: () => <div data-test-id="home-widgets-grid" />,
}));

import { useExtensionsWithLoadingState } from "@dashboard/extensions/hooks/useExtensions";

const useExtensionsWithLoadingStateMock = useExtensionsWithLoadingState as jest.Mock;

const renderHomePage = (path = "/home/widgets") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Route path={["/home/widget/:extensionId", "/home/widgets", "/home"]}>
        <HomePage />
      </Route>
    </MemoryRouter>,
  );

const renderRouteHook = (initialPath: string) =>
  renderHook(() => useHomeRouteParams(), {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <MemoryRouter initialEntries={[initialPath]}>
        <Route path={["/home/widget/:extensionId", "/home/widgets", "/home"]}>{children}</Route>
      </MemoryRouter>
    ),
  });

describe("useHomeRouteParams", () => {
  it("returns undefined extensionId and isWidgetsRoute=false on bare /home", () => {
    // Arrange & Act
    const { result } = renderRouteHook("/home");

    // Assert
    expect(result.current.extensionId).toBeUndefined();
    expect(result.current.isWidgetsRoute).toBe(false);
  });

  it("flags isWidgetsRoute=true on /home/widgets", () => {
    // Arrange & Act
    const { result } = renderRouteHook(homeWidgetsUrl());

    // Assert
    expect(result.current.isWidgetsRoute).toBe(true);
    expect(result.current.extensionId).toBeUndefined();
  });

  it("decodes a plain extensionId from the URL", () => {
    // Arrange
    const id = "app-123";

    // Act
    const { result } = renderRouteHook(homeWidgetUrl(id));

    // Assert
    expect(result.current.extensionId).toBe(id);
    expect(result.current.isWidgetsRoute).toBe(false);
  });

  it("round-trips a base64-style global ID containing '+', '/', and '='", () => {
    // Arrange - shape of a typical Saleor global ID. These chars are URI-reserved,
    // so the history library's decodeURI does not touch them; the hook's
    // decodeURIComponent has to finish the job.
    const id = "QXBwRXh0ZW5zaW9uOjE+/=";

    // Act
    const { result } = renderRouteHook(homeWidgetUrl(id));

    // Assert
    expect(result.current.extensionId).toBe(id);
  });

  it("decodes URL-encoded spaces correctly without double-decoding", () => {
    // Arrange - guards against decoding twice. A single space "%20" should
    // come back as " ", not as something else.
    const id = "app id with spaces";

    // Act
    const { result } = renderRouteHook(homeWidgetUrl(id));

    // Assert
    expect(result.current.extensionId).toBe(id);
    expect(result.current.extensionId).not.toContain("%20");
  });

  it("does not strip the encoded portion of a base64 global ID (single decode pass)", () => {
    // Arrange - regression guard: if we accidentally skipped decoding, the ID
    // would still contain "%2B" / "%3D" sequences instead of "+"/"=".
    const id = "QXBwRXh0ZW5zaW9uOjE=";

    // Act
    const { result } = renderRouteHook(homeWidgetUrl(id));

    // Assert
    expect(result.current.extensionId).toBe(id);
    expect(result.current.extensionId).not.toContain("%3D");
    expect(result.current.extensionId).not.toContain("%2B");
  });
});

describe("HomePage states", () => {
  it("renders neither Pulse promo nor tabs while loading", () => {
    // Arrange
    useExtensionsWithLoadingStateMock.mockReturnValue({
      extensions: { HOMEPAGE_WIDGETS: [] },
      loading: true,
    });

    // Act
    renderHomePage();

    // Assert
    expect(screen.getByTestId("home-extensions-loading")).toBeInTheDocument();
    expect(screen.queryByText("See how your store is doing")).not.toBeInTheDocument();
    expect(screen.queryByTestId("home-widgets-grid")).not.toBeInTheDocument();
    expect(screen.queryByTestId("home-pulse-cta")).not.toBeInTheDocument();
  });

  it("renders the Pulse empty state when loaded with no extensions", () => {
    // Arrange
    useExtensionsWithLoadingStateMock.mockReturnValue({
      extensions: { HOMEPAGE_WIDGETS: [] },
      loading: false,
    });

    // Act
    renderHomePage();

    // Assert
    expect(screen.getByText("See how your store is doing")).toBeInTheDocument();
    expect(screen.getByTestId("home-pulse-cta")).toBeInTheDocument();
    expect(screen.getByTestId("home-create-own-homepage-link")).toHaveAttribute(
      "href",
      expect.stringContaining("extending-dashboard-with-apps"),
    );
  });

  it("keeps visited Home iframes mounted when /home redirects to the leftmost tab", () => {
    // Arrange — sidebar Home always navigates to /home, which then redirects
    // to the leftmost widget. Returning <Redirect> alone would unmount keep-alive.
    const pulse = panelExtension("pulse", "Pulse");
    const onboarding = panelExtension("onboarding", "Get ready to sell");

    useExtensionsWithLoadingStateMock.mockReturnValue({
      extensions: { HOMEPAGE_WIDGETS: [pulse, onboarding] },
      loading: false,
    });

    const history = createMemoryHistory({
      initialEntries: [homeWidgetUrl("onboarding")],
    });

    render(
      <Router history={history}>
        <Route path={["/home/widget/:extensionId", "/home/widgets", "/home"]}>
          <HomePage />
        </Route>
      </Router>,
    );

    expect(screen.getByTestId("home-widget-view-onboarding")).toBeInTheDocument();
    expect(screen.queryByTestId("home-widget-view-pulse")).not.toBeInTheDocument();

    // Act
    act(() => {
      history.push("/home");
    });

    // Assert — Pulse becomes the active (leftmost) tab; Onboarding stays mounted
    expect(screen.getByTestId("home-widget-view-onboarding")).toBeInTheDocument();
    expect(screen.getByTestId("home-widget-view-pulse")).toBeInTheDocument();
  });
});

const panelExtension = (id: string, label: string): Extension => ({
  id,
  app: {
    __typename: "App",
    id: `app-${id}`,
    appUrl: "https://app.example",
    name: label,
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label,
  identifier: null,
  mountName: "HOMEPAGE_WIDGETS",
  url: `https://app.example/${id}`,
  open: () => undefined,
  targetName: "WIDGET",
  settings: { homeWidgetTarget: { fullscreen: true, method: "POST" } },
  isSaleorOfficial: true,
  fromCache: false,
});

describe("HomeTabPanels keep-alive", () => {
  it("keeps a visited fullscreen widget mounted when switching tabs", () => {
    // Arrange
    const pulse = panelExtension("pulse", "Pulse");
    const onboarding = panelExtension("onboarding", "Get ready to sell");

    const { rerender } = render(
      <HomeTabPanels
        fullscreen={[pulse, onboarding]}
        widgets={[]}
        activeTab={{ kind: "extension", id: "pulse" }}
        showWidgetsTab={false}
      />,
    );

    expect(screen.getByTestId("home-widget-panel-pulse")).toHaveAttribute("data-active", "true");
    expect(screen.queryByTestId("home-widget-panel-onboarding")).not.toBeInTheDocument();

    // Act
    rerender(
      <HomeTabPanels
        fullscreen={[pulse, onboarding]}
        widgets={[]}
        activeTab={{ kind: "extension", id: "onboarding" }}
        showWidgetsTab={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("home-widget-panel-pulse")).toHaveAttribute("data-active", "false");
    expect(screen.getByTestId("home-widget-panel-onboarding")).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(screen.getByTestId("home-widget-view-pulse")).toBeInTheDocument();
    expect(screen.getByTestId("home-widget-view-onboarding")).toBeInTheDocument();
  });

  it("does not mount a fullscreen widget until its tab is visited", () => {
    // Arrange
    const pulse = panelExtension("pulse", "Pulse");
    const onboarding = panelExtension("onboarding", "Get ready to sell");

    // Act
    render(
      <HomeTabPanels
        fullscreen={[pulse, onboarding]}
        widgets={[]}
        activeTab={{ kind: "extension", id: "pulse" }}
        showWidgetsTab={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("home-widget-view-pulse")).toBeInTheDocument();
    expect(screen.queryByTestId("home-widget-view-onboarding")).not.toBeInTheDocument();
  });

  it("keeps the widgets grid mounted after visiting it", () => {
    // Arrange
    const pulse = panelExtension("pulse", "Pulse");
    const chart = panelExtension("chart", "Chart");

    const { rerender } = render(
      <HomeTabPanels
        fullscreen={[pulse]}
        widgets={[chart]}
        activeTab={{ kind: "extension", id: "pulse" }}
        showWidgetsTab={true}
      />,
    );

    expect(screen.queryByTestId("home-widgets-grid-panel")).not.toBeInTheDocument();

    // Act
    rerender(
      <HomeTabPanels
        fullscreen={[pulse]}
        widgets={[chart]}
        activeTab={{ kind: "widgets" }}
        showWidgetsTab={true}
      />,
    );

    expect(screen.getByTestId("home-widgets-grid-panel")).toBeInTheDocument();
    expect(screen.getByTestId("home-widget-view-pulse")).toBeInTheDocument();

    rerender(
      <HomeTabPanels
        fullscreen={[pulse]}
        widgets={[chart]}
        activeTab={{ kind: "extension", id: "pulse" }}
        showWidgetsTab={true}
      />,
    );

    // Assert
    expect(screen.getByTestId("home-widgets-grid-panel")).toBeInTheDocument();
    expect(screen.getByTestId("home-widget-panel-pulse")).toHaveAttribute("data-active", "true");
  });
});
