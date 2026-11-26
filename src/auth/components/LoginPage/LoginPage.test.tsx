import { type AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { type ReactNode } from "react";

import { LoginPage } from "./LoginPage";

type AuthType = AvailableExternalAuthenticationsQuery["shop"]["availableExternalAuthentications"];

const mockExternalAuth = {
  id: "cloud",
  name: "Cloud",
  __typename: "ExternalAuthentication",
} as AuthType[0];

const defaultProps = {
  errors: [],
  disabled: false,
  loading: false,
  externalAuthentications: [mockExternalAuth],
  passwordLoginEnabled: true,
  onExternalAuthentication: jest.fn(),
  onSubmit: jest.fn(),
};

jest.mock("react-router-dom", () => ({
  MemoryRouter: ({ children }: { children: ReactNode }): ReactNode => <>{children}</>,
  Link: ({ children, ...rest }: { children: ReactNode; [key: string]: unknown }): ReactNode => (
    <a {...rest}>{children}</a>
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Password login disabled", () => {
    it("hides email and password inputs when password login is disabled", () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod={null} {...defaultProps} passwordLoginEnabled={false} />);

      // Assert
      expect(screen.queryByTestId("email")).not.toBeInTheDocument();
      expect(screen.queryByTestId("password")).not.toBeInTheDocument();
      expect(screen.queryByTestId("submit")).not.toBeInTheDocument();
      expect(screen.queryByTestId("reset-password-link")).not.toBeInTheDocument();
      expect(screen.getByTestId("external-authentication")).toBeInTheDocument();
    });

    it("shows empty state message when password login is disabled and no external auth", () => {
      // Arrange & Act
      render(
        <LoginPage
          lastLoginMethod={null}
          {...defaultProps}
          passwordLoginEnabled={false}
          externalAuthentications={[]}
        />,
      );

      // Assert
      expect(screen.queryByTestId("email")).not.toBeInTheDocument();
      expect(screen.queryByTestId("external-authentication")).not.toBeInTheDocument();
      expect(screen.getByText(/Password login is disabled/)).toBeInTheDocument();
    });

    it("shows spinner when loading and no login methods are known yet", () => {
      // Arrange & Act
      render(
        <LoginPage
          lastLoginMethod={null}
          {...defaultProps}
          passwordLoginEnabled={false}
          externalAuthentications={undefined}
          loading={true}
        />,
      );

      // Assert
      expect(screen.getByTestId("login-methods-loading")).toBeInTheDocument();
      expect(screen.queryByText(/Password login is disabled/)).not.toBeInTheDocument();
    });

    it("shows spinner when externalAuthentications is undefined even if loading is false", () => {
      // Arrange & Act
      render(
        <LoginPage
          lastLoginMethod={null}
          {...defaultProps}
          passwordLoginEnabled={false}
          externalAuthentications={undefined}
          loading={false}
        />,
      );

      // Assert
      expect(screen.getByTestId("login-methods-loading")).toBeInTheDocument();
      expect(screen.queryByText(/Password login is disabled/)).not.toBeInTheDocument();
    });

    it("shows an error with retry instead of the spinner when login methods failed to load", async () => {
      // Arrange
      const onRetryLoginMethods = jest.fn();

      render(
        <LoginPage
          lastLoginMethod={null}
          {...defaultProps}
          passwordLoginEnabled={false}
          externalAuthentications={undefined}
          loading={false}
          loginMethodsError={true}
          onRetryLoginMethods={onRetryLoginMethods}
        />,
      );

      // Act
      await userEvent.click(screen.getByTestId("login-methods-retry"));

      // Assert
      expect(screen.queryByTestId("login-methods-loading")).not.toBeInTheDocument();
      expect(screen.getByTestId("login-methods-error")).toBeInTheDocument();
      expect(screen.queryByText(/Password login is disabled/)).not.toBeInTheDocument();
      expect(onRetryLoginMethods).toHaveBeenCalledTimes(1);
    });

    it("shows the spinner while a retry after a failed request is loading", () => {
      // Arrange & Act
      render(
        <LoginPage
          lastLoginMethod={null}
          {...defaultProps}
          passwordLoginEnabled={false}
          externalAuthentications={undefined}
          loading={true}
          loginMethodsError={true}
        />,
      );

      // Assert
      expect(screen.getByTestId("login-methods-loading")).toBeInTheDocument();
      expect(screen.queryByTestId("login-methods-error")).not.toBeInTheDocument();
    });

    it("shows email and password inputs when password login is enabled", () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod={null} {...defaultProps} passwordLoginEnabled={true} />);

      // Assert
      expect(screen.getByTestId("email")).toBeInTheDocument();
      expect(screen.getByTestId("password")).toBeInTheDocument();
      expect(screen.getByTestId("submit")).toBeInTheDocument();
    });
  });

  describe("Password visibility toggle", () => {
    it("toggles password input type when clicking the reveal button", async () => {
      // Arrange
      render(<LoginPage lastLoginMethod={null} {...defaultProps} />);

      const passwordInput = screen.getByTestId("password");
      const toggleButton = screen.getByTestId("password-visibility-toggle");

      expect(passwordInput).toHaveAttribute("type", "password");

      // Act
      await userEvent.click(toggleButton);

      // Assert
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(toggleButton).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("External Authentication", () => {
    it("sets optimisticLoaderAuthId when clicking external auth button", async () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod={null} {...defaultProps} />);

      const authButton = screen.getByRole("button", { name: "Cloud" });

      await userEvent.click(authButton);

      // Assert
      await waitFor(() => {
        expect(authButton).toHaveAttribute("data-test-state", "loading");
        expect(defaultProps.onExternalAuthentication).toHaveBeenCalledWith(mockExternalAuth.id);
      });
    });

    it("shows loader only for clicked authentication method", async () => {
      // Arrange
      const twoAuths = [
        { id: "oidc", name: "OIDC" },
        { id: "cloud", name: "Cloud" },
      ] as AuthType;

      // Act
      render(
        <LoginPage lastLoginMethod={null} {...defaultProps} externalAuthentications={twoAuths} />,
      );

      const oidcButton = screen.getByRole("button", { name: "OIDC" });
      const cloudButton = screen.getByRole("button", { name: "Cloud" });

      await userEvent.click(oidcButton);

      // Assert
      await waitFor(() => {
        expect(cloudButton).not.toHaveAttribute("data-test-state", "loading");
        expect(oidcButton).toHaveAttribute("data-test-state", "loading");
      });
    });
  });

  describe("Last used indicator", () => {
    it("places the Last used chip on the submit button when password was last used", () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod="password" {...defaultProps} />);

      // Assert
      const submitButton = screen.getByTestId("submit");

      expect(submitButton).toHaveTextContent(/Last used/);
      expect(submitButton).toHaveAttribute("aria-describedby", "auth-last-used");
    });

    it("places the Last used chip on the matching external provider button", () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod="cloud" {...defaultProps} />);

      // Assert
      const authButton = screen.getByRole("button", { name: "Cloud" });

      expect(authButton).toHaveTextContent(/Last used/);
      expect(authButton).toHaveAttribute("aria-describedby", "auth-last-used");
    });
  });
});
