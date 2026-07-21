import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { RootRoutes } from "./RootRoutes";

// `@sentry/react` is auto-mocked in the test setup, which turns the Sentry-wrapped
// `Route` from the shared Router module into `undefined`. Use the plain react-router
// `Route` instead so routing actually resolves.
jest.mock("@dashboard/components/Router", () => ({
  Route: jest.requireActual("react-router-dom").Route,
}));

// The set-password view is lazy-loaded and pulls in Layout + the auth SDK. This test
// only exercises routing precedence, so stub the view with a recognizable marker.
jest.mock("../views/NewPasswordStandalone", () => ({
  __esModule: true,
  default: () => <div data-test-id="new-password-view">Set up new password</div>,
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <RootRoutes>
        {/* Stands in for the authentication gate. For a logged-in user this branch
            renders the app, whose unmatched routes fall through to NotFound (404). */}
        <div data-test-id="auth-gated-content">authenticated app</div>
      </RootRoutes>
    </MemoryRouter>,
  );

describe("RootRoutes", () => {
  it("renders the set-password view at /new-password even though the auth gate would render the app (regression: OIDC-authenticated users saw a 404)", async () => {
    // Arrange & Act
    renderAt("/new-password?email=user%40example.com&token=abc123");

    // Assert
    expect(await screen.findByTestId("new-password-view")).toBeInTheDocument();
    expect(screen.queryByTestId("auth-gated-content")).not.toBeInTheDocument();
  });

  it("matches /new-password regardless of a trailing slash", async () => {
    // Arrange & Act
    renderAt("/new-password/?email=user%40example.com&token=abc123");

    // Assert
    expect(await screen.findByTestId("new-password-view")).toBeInTheDocument();
    expect(screen.queryByTestId("auth-gated-content")).not.toBeInTheDocument();
  });

  it("renders the auth-gated content on all other paths", () => {
    // Arrange & Act
    renderAt("/orders");

    // Assert
    expect(screen.getByTestId("auth-gated-content")).toBeInTheDocument();
    expect(screen.queryByTestId("new-password-view")).not.toBeInTheDocument();
  });
});
