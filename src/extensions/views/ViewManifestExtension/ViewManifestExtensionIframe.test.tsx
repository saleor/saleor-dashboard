import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useAppQuery } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { ViewManifestExtensionIframe } from "./ViewManifestExtensionIframe";

jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  useAppQuery: jest.fn(),
}));

jest.mock("@dashboard/hooks/useHasManagedAppsPermission", () => ({
  useHasManagedAppsPermission: () => ({ hasManagedAppsPermission: true }),
}));

jest.mock("@dashboard/hooks/useNavigator", () => () => jest.fn());

jest.mock("@dashboard/hooks/useNotifier", () => ({
  useNotifier: () => jest.fn(),
}));

jest.mock("./components/AppPage/AppPage", () => ({
  AppPage: ({ url }: { url: string }) => <div data-test-id="app-page">{url}</div>,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Switch>
        <Route
          path="/extensions/app/:id/edit"
          render={() => <div data-test-id="manage-screen" />}
        />
        <Route
          path="/extensions/app/:id"
          render={() => <ViewManifestExtensionIframe id="app-1" />}
        />
      </Switch>
    </MemoryRouter>,
  );

describe("ViewManifestExtensionIframe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to manage screen when app has no appUrl", () => {
    // Arrange
    (useAppQuery as jest.Mock).mockReturnValue({
      data: { app: { id: "app-1", appUrl: null } },
      refetch: jest.fn(),
    });

    // Act
    renderAt("/extensions/app/app-1");

    // Assert
    expect(screen.getByTestId("manage-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("app-page")).not.toBeInTheDocument();
  });

  it("renders the app iframe page when appUrl is present", () => {
    // Arrange
    (useAppQuery as jest.Mock).mockReturnValue({
      data: { app: { id: "app-1", appUrl: "https://example.com" } },
      refetch: jest.fn(),
    });

    // Act
    renderAt("/extensions/app/app-1");

    // Assert
    expect(screen.getByTestId("app-page")).toBeInTheDocument();
    expect(screen.queryByTestId("manage-screen")).not.toBeInTheDocument();
  });

  it("redirect target matches the manage URL helper", () => {
    expect(ExtensionsUrls.resolveEditManifestExtensionUrl("app-1")).toContain(
      "/extensions/app/app-1/edit",
    );
  });
});
