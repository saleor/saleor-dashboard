import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { ResolveAppId } from "./ResolveAppId";

const mockResolveAppIdFromIdentifier = jest.fn();

jest.mock("@dashboard/extensions/hooks/useAppNavigation", () => ({
  useAppNavigation: () => ({ resolveAppIdFromIdentifier: mockResolveAppIdFromIdentifier }),
}));

const APP_ID = btoa("App:1");

const renderAt = (path: string) =>
  render(
    <IntlProvider defaultLocale="en" locale="en">
      <MemoryRouter initialEntries={[path]}>
        <Switch>
          <Route path="/extensions/explore" render={() => <div data-test-id="explore" />} />
          <Route
            path="/extensions/app/:id"
            render={({ match }) => (
              <ResolveAppId segment={decodeURIComponent(match.params.id)}>
                {id => <div data-test-id="app-view">{id}</div>}
              </ResolveAppId>
            )}
          />
        </Switch>
        <Route
          render={({ location }) => (
            <div data-test-id="location">{location.pathname + location.search + location.hash}</div>
          )}
        />
      </MemoryRouter>
    </IntlProvider>,
  );

describe("ResolveAppId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Renders straight away when the URL already carries an app id", () => {
    // Act
    renderAt(`/extensions/app/${encodeURIComponent(APP_ID)}`);

    // Assert
    expect(screen.getByTestId("app-view")).toHaveTextContent(APP_ID);
    expect(mockResolveAppIdFromIdentifier).not.toHaveBeenCalled();
  });

  it("Replaces a manifest identifier with the resolved app id, keeping deep path, query and hash", async () => {
    // Arrange
    mockResolveAppIdFromIdentifier.mockResolvedValue(APP_ID);

    // Act
    renderAt("/extensions/app/saleor.app.adyen/configuration?foo=1#section");

    // Assert
    expect(await screen.findByTestId("app-view")).toHaveTextContent(APP_ID);
    expect(screen.getByTestId("location")).toHaveTextContent(
      `/extensions/app/${encodeURIComponent(APP_ID)}/configuration?foo=1#section`,
    );
    expect(mockResolveAppIdFromIdentifier).toHaveBeenCalledWith("saleor.app.adyen");
  });

  it("Sends the user to Explore when no installed app matches the identifier", async () => {
    // Arrange
    mockResolveAppIdFromIdentifier.mockResolvedValue(null);

    // Act
    renderAt("/extensions/app/saleor.app.adyen");

    // Assert
    expect(await screen.findByTestId("explore")).toBeInTheDocument();
  });

  it("Shows an error instead of assuming the app is missing when the lookup fails", async () => {
    // Arrange
    mockResolveAppIdFromIdentifier.mockRejectedValue(new Error("network down"));

    // Act
    renderAt("/extensions/app/saleor.app.adyen");

    // Assert
    expect(await screen.findByText("Couldn’t open this extension. Try again.")).toBeInTheDocument();
    expect(screen.queryByTestId("explore")).not.toBeInTheDocument();
  });
});
