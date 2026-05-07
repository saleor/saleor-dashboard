import { renderHook } from "@testing-library/react";
import type React from "react";
import { MemoryRouter, Route } from "react-router-dom";

import { useHomeRouteParams } from "./HomePage";
import { homeWidgetsUrl, homeWidgetUrl } from "./urls";

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
