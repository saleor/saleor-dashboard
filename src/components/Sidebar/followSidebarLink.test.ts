import { createMemoryHistory, type MemoryHistory } from "history";

import { followSidebarLink } from "./followSidebarLink";

interface ClickResult {
  followed: boolean;
  defaultPrevented: boolean;
}

const clickLink = (html: string, history: MemoryHistory): ClickResult => {
  document.body.innerHTML = html;

  const anchor = document.querySelector("a");
  let result: ClickResult = { followed: false, defaultPrevented: false };

  anchor?.addEventListener("click", event => {
    const followed = followSidebarLink(event, history);

    result = { followed, defaultPrevented: event.defaultPrevented };
    // jsdom does not load pages; stop it from logging a navigation error.
    event.preventDefault();
  });
  anchor?.click();

  return result;
};

describe("followSidebarLink", () => {
  const originalConfig = window.__SALEOR_CONFIG__;

  afterEach(() => {
    document.body.innerHTML = "";
    window.__SALEOR_CONFIG__ = originalConfig;
  });

  it("opens an app page through the router instead of loading it", () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ["/home"] });

    // Act
    const result = clickLink('<a href="/orders">Orders</a>', history);

    // Assert
    expect(result).toEqual({ followed: true, defaultPrevented: true });
    expect(history.location.pathname).toBe("/orders");
    expect(history.action).toBe("PUSH");
  });

  it("replaces the entry when the link points to the current page", () => {
    // Arrange
    const history = createMemoryHistory({ initialEntries: ["/orders"] });

    // Act
    clickLink('<a href="/orders">Orders</a>', history);

    // Assert
    expect(history.action).toBe("REPLACE");
    expect(history.length).toBe(1);
  });

  it("strips the dashboard mount path before routing", () => {
    // Arrange
    window.__SALEOR_CONFIG__ = { ...originalConfig, APP_MOUNT_URI: "/dashboard/" };

    const history = createMemoryHistory({ initialEntries: ["/home"] });

    // Act
    clickLink('<a href="/dashboard/orders?status=paid">Orders</a>', history);

    // Assert
    expect(history.location.pathname).toBe("/orders");
    expect(history.location.search).toBe("?status=paid");
  });

  it.each([
    ["a new-tab link", '<a href="/orders" target="_blank">Orders</a>'],
    ["another site", '<a href="https://cloud.saleor.io/">Cloud</a>'],
    ["a page outside the dashboard", '<a href="/graphql/">API</a>'],
  ])("leaves %s to the browser", (_, html) => {
    // Arrange
    window.__SALEOR_CONFIG__ = { ...originalConfig, APP_MOUNT_URI: "/dashboard/" };

    const history = createMemoryHistory({ initialEntries: ["/home"] });

    // Act
    const result = clickLink(html, history);

    // Assert
    expect(result).toEqual({ followed: false, defaultPrevented: false });
    expect(history.location.pathname).toBe("/home");
  });
});
