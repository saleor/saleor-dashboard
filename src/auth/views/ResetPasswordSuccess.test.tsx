import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

import ResetPasswordSuccessView from "./ResetPasswordSuccess";

const MOUNT_URI = "/dashboard/";

// The Dashboard is served from a sub-path, and the router's basename is that same path.
jest.mock("@dashboard/config", () => ({
  ...jest.requireActual<object>("@dashboard/config"),
  getAppMountUri: (): string => "/dashboard/",
}));

describe("ResetPasswordSuccessView", () => {
  it("goes back to the sign-in page without repeating the mount URI", async () => {
    // Arrange
    const history = createBrowserHistory({ basename: MOUNT_URI });

    history.push("/reset-password/success/");
    render(
      <Router history={history}>
        <ResetPasswordSuccessView />
      </Router>,
    );

    // Act
    await userEvent.click(screen.getByTestId("back-to-login-button"));

    // Assert
    expect(window.location.pathname).toBe(MOUNT_URI);
  });
});
