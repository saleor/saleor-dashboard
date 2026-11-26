import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createBrowserHistory } from "history";
import { type ReactNode } from "react";
import { Router } from "react-router-dom";

import { ResetPasswordPage } from "./ResetPasswordPage";

const MOUNT_URI = "/dashboard/";

// The Dashboard is served from a sub-path, and the router's basename is that same path.
jest.mock("@dashboard/config", () => ({
  ...jest.requireActual<object>("@dashboard/config"),
  getAppMountUri: (): string => "/dashboard/",
}));

const renderUnderMountUri = (ui: ReactNode): void => {
  const history = createBrowserHistory({ basename: MOUNT_URI });

  render(<Router history={history}>{ui}</Router>);
};

describe("ResetPasswordPage", () => {
  it("links back to the sign-in page without repeating the mount URI", () => {
    // Arrange & Act
    renderUnderMountUri(<ResetPasswordPage disabled={false} onSubmit={jest.fn()} />);

    // Assert
    expect(screen.getByTestId("back-to-login-link")).toHaveAttribute("href", MOUNT_URI);
  });

  it("doesn't send the request when the browser refuses an invalid email", async () => {
    // Arrange
    const onSubmit = jest.fn();

    renderUnderMountUri(<ResetPasswordPage disabled={false} onSubmit={onSubmit} />);

    const emailInput = screen.getByTestId("email");

    // jsdom doesn't validate a form before submitting it, so stand in for the browser, which
    // never fires `submit` for an empty required field.
    emailInput.closest("form")?.addEventListener("submit", event => {
      event.preventDefault();
      event.stopPropagation();
    });

    // Act
    await userEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends the email once when the form is submitted", async () => {
    // Arrange
    const onSubmit = jest.fn(async () => []);

    renderUnderMountUri(<ResetPasswordPage disabled={false} onSubmit={onSubmit} />);

    // Act
    await userEvent.type(screen.getByTestId("email"), "staff@example.com");
    await userEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: "staff@example.com" });
  });
});
