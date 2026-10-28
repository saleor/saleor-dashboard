import { useCloud } from "@dashboard/auth/hooks/useCloud";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { useNavigatorSearchContext } from "@dashboard/components/NavigatorSearch/useNavigatorSearchContext";
import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { useCanSearch } from "@dashboard/search/useCanSearch";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { MemoryRouter } from "react-router-dom";

import { useMenuStructure } from "./menu/hooks/useMenuStructure";
import { type SidebarMenuItem } from "./menu/types";
import { Sidebar } from "./Sidebar";
import {
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  SIDEBAR_SHORTCUT_KNOWN_STORAGE_KEY,
  SidebarProvider,
  useCustomSidebarBreakpoint,
} from "./SidebarContext";

const mockFeedbackSurvey = jest.fn(() => ({ isAvailable: true }));

jest.mock("./user/useFeedbackSurvey", () => ({
  useFeedbackSurvey: () => mockFeedbackSurvey(),
}));

jest.mock("./menu/hooks/useMenuStructure", () => ({
  useMenuStructure: jest.fn(() => []),
}));
jest.mock("@dashboard/search/useCanSearch", () => ({
  useCanSearch: jest.fn(() => false),
}));
jest.mock("@dashboard/featureFlags/useFlagsInfo", () => ({
  useFlagsInfo: jest.fn(() => []),
}));
jest.mock("@dashboard/auth/hooks/useCloud", () => ({
  useCloud: jest.fn(() => ({
    isAuthenticatedViaCloud: false,
  })),
}));
jest.mock("@dashboard/components/DevModePanel/hooks", () => ({
  useDevModeContext: jest.fn(() => ({
    variables: "",
    setVariables: jest.fn(),
    isDevModeVisible: false,
    setDevModeVisibility: jest.fn(),
    devModeContent: "",
    setDevModeContent: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/NavigatorSearch/useNavigatorSearchContext", () => ({
  useNavigatorSearchContext: jest.fn(() => ({
    isNavigatorVisible: false,
    setNavigatorVisibility: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: jest.fn(() => ({
    initialize: jest.fn(),
    trackEvent: jest.fn(),
  })),
}));
jest.mock("@dashboard/components/ProductAnalytics/config", () => ({
  isProductAnalyticsEnabled: () => true,
}));
jest.mock("@dashboard/ripples/state", () => ({
  useAllRipplesModalState: jest.fn(() => ({
    isModalOpen: false,
    setModalState: jest.fn(),
  })),
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MemoryRouter initialEntries={["/categories/"]}>
      {/* @ts-expect-error - legacy types */}
      <LegacyThemeProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </LegacyThemeProvider>
    </MemoryRouter>
  );
};

describe("Sidebar", () => {
  it("renders the global feedback trigger", () => {
    // Arrange
    mockFeedbackSurvey.mockReturnValue({ isAvailable: true });

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole("button", { name: "Send feedback" })).toHaveAttribute(
      "data-posthog-feedback-trigger",
      "true",
    );
  });

  it("hides feedback when its survey is unavailable", () => {
    // Arrange
    mockFeedbackSurvey.mockReturnValue({ isAvailable: false });

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.queryByRole("button", { name: "Send feedback" })).not.toBeInTheDocument();
    expect(screen.getByTestId("feedback-button")).not.toBeVisible();
    expect(screen.getByTestId("feedback-button")).toHaveAttribute(
      "data-posthog-feedback-trigger",
      "true",
    );
  });

  it.each([
    { state: "expanded", collapsed: "false" },
    { state: "collapsed", collapsed: "true" },
  ])("offers the Saleor Cloud link in the user menu when $state", async ({ collapsed }) => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: true,
    }));
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, collapsed);
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByTestId("userMenu"));

    // Assert
    expect(await screen.findByRole("menuitem", { name: "Go to Saleor Cloud" })).toBeVisible();
    expect(screen.getAllByTestId("cloud-environment-link")).toHaveLength(1);
  });
  it("should not render cloud environment link when is not cloud instance", async () => {
    // Arrange
    (useCloud as jest.Mock).mockImplementation(() => ({
      isAuthenticatedViaCloud: false,
    }));
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByTestId("userMenu"));

    // Assert
    expect(await screen.findByTestId("log-out-button")).toBeInTheDocument();
    expect(screen.queryByTestId("cloud-environment-link")).not.toBeInTheDocument();
  });
  it("should render keyboard shortcuts", () => {
    // Arrange & Act
    render(<Sidebar />, { wrapper: Wrapper });
    // Assert
    expect(screen.getByText("Command menu")).toBeInTheDocument();
    expect(screen.getByText("Playground")).toBeInTheDocument();
  });
  it("should call callback when click on playground shortcut", async () => {
    // Arrange
    const actionCallback = jest.fn();

    (useDevModeContext as jest.Mock).mockImplementationOnce(() => ({
      variables: "",
      setVariables: jest.fn(),
      isDevModeVisible: false,
      setDevModeVisibility: actionCallback,
      devModeContent: "",
      setDevModeContent: jest.fn(),
    }));
    render(<Sidebar />, { wrapper: Wrapper });
    // Act
    await userEvent.click(screen.getByText("Playground"));
    // Assert
    expect(actionCallback).toHaveBeenCalledWith(true);
  });
  it("should call callback when click on search shortcut", async () => {
    // Arrange
    const actionCallback = jest.fn();

    (useNavigatorSearchContext as jest.Mock).mockImplementationOnce(() => ({
      isNavigatorVisible: false,
      setNavigatorVisibility: actionCallback,
    }));
    render(<Sidebar />, { wrapper: Wrapper });
    // Act
    await userEvent.click(screen.getByText("Command menu"));
    // Assert
    expect(actionCallback).toHaveBeenCalledWith(true);
  });
});

const catalogGroup: SidebarMenuItem = {
  id: "products",
  label: "Catalog",
  url: "/products/",
  type: "itemGroup",
  icon: <span />,
  children: [
    { id: "products", label: "Products", url: "/products/", type: "item" },
    { id: "categories", label: "Categories", url: "/categories/", type: "item" },
  ],
};

const configurationItem: SidebarMenuItem = {
  id: "configure",
  label: "Configuration",
  url: "/configuration/",
  type: "item",
  icon: <span />,
};

const getCollapseShortcutHandler = (): ((event: KeyboardEvent) => void) => {
  const call = (useHotkeys as jest.Mock).mock.calls.findLast(([keys]) => keys === "mod+b");

  return call[1];
};

/** jsdom has no `matchMedia`; without one the sidebar assumes the desktop column. */
const setViewportWidth = (width: number): void => {
  const matchMedia = (query: string): MediaQueryList => {
    const minWidth = /min-width:\s*(\d+)px/.exec(query)?.[1];

    return {
      matches: minWidth !== undefined && width >= Number(minWidth),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  };

  Object.defineProperty(window, "matchMedia", { configurable: true, value: matchMedia });
};

const WidePage = () => {
  useCustomSidebarBreakpoint("wide");

  return null;
};

describe("Sidebar collapse", () => {
  beforeEach(() => {
    localStorage.clear();
    (useMenuStructure as jest.Mock).mockReturnValue([catalogGroup, configurationItem]);
  });

  afterEach(() => {
    (useMenuStructure as jest.Mock).mockReturnValue([]);
    Reflect.deleteProperty(window, "matchMedia");
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("collapses to the icon rail and remembers the choice", async () => {
    // Arrange
    const trackEvent = jest.fn();

    (useAnalytics as jest.Mock).mockReturnValue({ initialize: jest.fn(), trackEvent });
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Collapse navigation" }));

    // Assert
    expect(screen.getByTestId("sidebar-column")).toHaveAttribute("data-collapsed", "true");
    expect(screen.getByRole("button", { name: "Expand navigation" })).toBeInTheDocument();
    expect(screen.queryByText("Saleor Dashboard")).not.toBeInTheDocument();
    expect(localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)).toBe("true");
    expect(trackEvent).toHaveBeenCalledWith("sidebar_collapse_toggled", {
      source: "button",
      state: "collapsed",
    });
  });

  it("starts collapsed when the preference is stored and expands back", async () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Expand navigation" }));

    // Assert
    expect(screen.getByText("Saleor Dashboard")).toBeInTheDocument();
    expect(localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)).toBe("false");
  });

  it("keeps keyboard focus on the toggle across both states", async () => {
    // Arrange
    render(<Sidebar />, { wrapper: Wrapper });
    screen.getByRole("button", { name: "Collapse navigation" }).focus();

    // Act
    await userEvent.keyboard("{Enter}");

    // Assert
    expect(screen.getByRole("button", { name: "Expand navigation" })).toHaveFocus();

    // Act
    await userEvent.keyboard("{Enter}");

    // Assert
    expect(screen.getByRole("button", { name: "Collapse navigation" })).toHaveFocus();
  });

  it("leaves focus alone after a mouse click on the toggle", async () => {
    // Arrange
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Collapse navigation" }));

    // Assert
    expect(screen.getByRole("button", { name: "Expand navigation" })).not.toHaveFocus();
  });

  it("waits for a deliberate hover before showing the toggle tooltip", async () => {
    // Arrange
    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await user.hover(screen.getByRole("button", { name: "Collapse navigation" }));
    act(() => jest.advanceTimersByTime(400));

    // Assert
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Act
    act(() => jest.advanceTimersByTime(400));

    // Assert
    expect(screen.getByRole("tooltip")).toHaveTextContent("Collapse navigation");
  });

  it("waits again when the pointer comes back to the toggle", async () => {
    // Arrange
    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Sidebar />, { wrapper: Wrapper });

    const toggle = screen.getByRole("button", { name: "Collapse navigation" });

    await user.hover(toggle);
    act(() => jest.advanceTimersByTime(800));
    await user.unhover(toggle);
    act(() => jest.advanceTimersByTime(1000));

    // Act
    await user.hover(toggle);
    act(() => jest.advanceTimersByTime(400));

    // Assert
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Act
    act(() => jest.advanceTimersByTime(400));

    // Assert
    expect(screen.getByRole("tooltip")).toHaveTextContent("Collapse navigation");
  });

  it("stops showing the toggle tooltip once the shortcut has been used", async () => {
    // Arrange
    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const event = new KeyboardEvent("keydown", { key: "b", metaKey: true, cancelable: true });

    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    act(() => getCollapseShortcutHandler()(event));
    await user.hover(screen.getByRole("button", { name: "Expand navigation" }));
    act(() => jest.advanceTimersByTime(1000));

    // Assert
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(localStorage.getItem(SIDEBAR_SHORTCUT_KNOWN_STORAGE_KEY)).toBe("true");
  });

  it("keeps teaching the shortcut to viewers who toggle with the button", async () => {
    // Arrange
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Collapse navigation" }));

    // Assert
    expect(localStorage.getItem(SIDEBAR_SHORTCUT_KNOWN_STORAGE_KEY)).toBeNull();
  });

  it("ignores a malformed stored preference", () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "yes");

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("sidebar-column")).toHaveAttribute("data-collapsed", "false");
  });

  it("keeps the drawer navigation expanded on phones", async () => {
    // Arrange
    setViewportWidth(500);
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    // Assert
    const drawer = screen.getByTestId("sidebar-drawer-content");

    expect(screen.queryByTestId("sidebar-column")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sidebar-rail")).not.toBeInTheDocument();
    expect(within(drawer).getByText("Saleor Dashboard")).toBeInTheDocument();
    expect(within(drawer).getByText("Products")).toBeInTheDocument();
    expect(
      within(drawer).queryByRole("button", { name: "Collapse navigation" }),
    ).not.toBeInTheDocument();
  });

  it("shows the rail on tablets and opens the full navigation over the page", async () => {
    // Arrange
    setViewportWidth(900);
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("sidebar-rail")).toHaveAttribute("data-collapsed", "true");
    expect(screen.queryByTestId("sidebar-column")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Catalog" })).toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    // Assert
    const drawer = screen.getByTestId("sidebar-drawer-content");

    expect(within(drawer).getByText("Saleor Dashboard")).toBeInTheDocument();
    expect(within(drawer).getByRole("link", { name: "Categories" })).toBeInTheDocument();
    expect(localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY)).toBeNull();
  });

  it.each([
    ["phones", 500],
    ["tablets", 900],
  ])("closes the navigation drawer after navigating on %s", async (_, width) => {
    // Arrange
    setViewportWidth(width);
    render(<Sidebar />, { wrapper: Wrapper });
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    // Act
    await userEvent.click(
      within(screen.getByTestId("sidebar-drawer-content")).getByRole("link", {
        name: "Configuration",
      }),
    );

    // Assert
    await waitFor(() => {
      expect(screen.queryByTestId("sidebar-drawer-content")).not.toBeInTheDocument();
    });
  });

  it("replaces the navigation column with an app bar on phones", async () => {
    // Arrange
    const trackEvent = jest.fn();

    (useAnalytics as jest.Mock).mockReturnValue({ initialize: jest.fn(), trackEvent });
    (useCanSearch as jest.Mock).mockReturnValue(true);
    setViewportWidth(500);
    render(<Sidebar />, { wrapper: Wrapper });

    const appBar = screen.getByTestId("sidebar-app-bar");

    // Assert
    expect(within(appBar).getByText("Saleor Dashboard")).toBeInTheDocument();
    expect(within(appBar).getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/search/),
    );

    // Act
    await userEvent.click(within(appBar).getByRole("button", { name: "Open navigation" }));

    // Assert
    expect(screen.getByTestId("sidebar-drawer-content")).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith("sidebar_drawer_opened", { layout: "drawer" });
  });

  it("leaves search out of the app bar without search permissions", () => {
    // Arrange
    (useCanSearch as jest.Mock).mockReturnValue(false);
    setViewportWidth(500);

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(
      within(screen.getByTestId("sidebar-app-bar")).queryByRole("link", { name: "Search" }),
    ).not.toBeInTheDocument();
  });

  it("reveals the current page and names the close button when the drawer opens", async () => {
    // Arrange
    const scrollIntoView = jest.spyOn(Element.prototype, "scrollIntoView");

    setViewportWidth(500);
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Open navigation" }));

    // Assert
    const drawer = screen.getByTestId("sidebar-drawer-content");
    const currentPage = within(drawer).getByRole("link", { name: "Categories" });

    expect(currentPage).toHaveAttribute("aria-current", "page");
    expect(scrollIntoView.mock.instances).toContain(currentPage);
    expect(within(drawer).getByRole("button", { name: "Close navigation" })).toBeInTheDocument();
  });

  it("switches wide pages to the rail below 1200px", () => {
    // Arrange
    setViewportWidth(1100);

    // Act
    const { rerender } = render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("sidebar-column")).toBeInTheDocument();

    // Act
    rerender(
      <>
        <WidePage />
        <Sidebar />
      </>,
    );

    // Assert
    expect(screen.getByTestId("sidebar-rail")).toBeInTheDocument();
  });

  it("toggles with the keyboard shortcut while the column is shown", () => {
    // Arrange
    render(<Sidebar />, { wrapper: Wrapper });

    const event = new KeyboardEvent("keydown", { key: "b", metaKey: true, cancelable: true });

    // Act
    act(() => getCollapseShortcutHandler()(event));

    // Assert
    expect(screen.getByTestId("sidebar-column")).toHaveAttribute("data-collapsed", "true");
    expect(event.defaultPrevented).toBe(true);
  });

  it.each([
    ["phones", 500],
    ["tablets", 900],
  ])("leaves the shortcut to the browser on %s", (_, width) => {
    // Arrange
    setViewportWidth(width);
    (useHotkeys as jest.Mock).mockClear();

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect((useHotkeys as jest.Mock).mock.calls.some(([keys]) => keys === "mod+b")).toBe(false);
  });

  it.each([
    ["phones", 500],
    ["tablets", 900],
    ["desktops", 1300],
  ])("keeps the search shortcut on %s while the navigation is closed", (_, width) => {
    // Arrange
    (useCanSearch as jest.Mock).mockReturnValue(true);
    setViewportWidth(width);
    (useHotkeys as jest.Mock).mockClear();

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(
      (useHotkeys as jest.Mock).mock.calls.some(
        ([keys, , options]) => keys === "/" && options.enabled === true,
      ),
    ).toBe(true);
  });

  it("names rail items and marks the section of the current page", () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole("link", { name: "Configuration" })).toHaveAttribute(
      "href",
      "/configuration/",
    );
    expect(screen.getByRole("button", { name: "Catalog" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByTestId("menu-item-label-products")).toHaveAttribute("data-active", "true");
  });

  it("opens a section's pages beside the rail and closes after navigating", async () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");
    render(<Sidebar />, { wrapper: Wrapper });

    // Act
    await userEvent.click(screen.getByRole("button", { name: "Catalog" }));

    const flyout = await screen.findByTestId("menu-rail-flyout-products");

    // Assert
    expect(within(flyout).getByText("Catalog")).toBeInTheDocument();
    expect(within(flyout).queryByRole("link", { name: "Catalog" })).not.toBeInTheDocument();
    expect(within(flyout).getByRole("link", { name: "Categories" })).toBeInTheDocument();

    // Act
    await userEvent.click(within(flyout).getByRole("link", { name: "Products" }));

    // Assert
    expect(screen.queryByTestId("menu-rail-flyout-products")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Catalog" })).toHaveFocus();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("closes a rail tooltip as soon as the pointer leaves the icon", async () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");
    render(<Sidebar />, { wrapper: Wrapper });

    const configuration = screen.getByRole("link", { name: "Configuration" });

    await userEvent.hover(configuration);
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Configuration");

    // Act
    await userEvent.unhover(configuration);

    // Assert
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("moves feedback into the rail and the account menu onto the avatar", () => {
    // Arrange
    localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "true");

    // Act
    render(<Sidebar />, { wrapper: Wrapper });

    // Assert
    expect(screen.getAllByTestId("feedback-button")).toHaveLength(1);
    expect(screen.getByTestId("feedback-button")).toHaveAttribute(
      "data-posthog-feedback-trigger",
      "true",
    );
    expect(screen.getByRole("button", { name: "Account menu" })).toHaveAttribute(
      "data-test-id",
      "userMenu",
    );
  });
});
