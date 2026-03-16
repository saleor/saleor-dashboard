import { type AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type * as React from "react";

import LoginPage from "./LoginPage";

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
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LoginPage", () => {
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

    it("shows email and password inputs when password login is enabled", () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod={null} {...defaultProps} passwordLoginEnabled={true} />);

      // Assert
      expect(screen.getByTestId("email")).toBeInTheDocument();
      expect(screen.getByTestId("password")).toBeInTheDocument();
      expect(screen.getByTestId("submit")).toBeInTheDocument();
    });
  });

  describe("External Authentication", () => {
    it("sets optimisticLoaderAuthId when clicking external auth button", async () => {
      // Arrange & Act
      render(<LoginPage lastLoginMethod={null} {...defaultProps} />);

      const authButton = screen.getByRole("button", { name: "Cloud" });

      userEvent.click(authButton);

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

      userEvent.click(oidcButton);

      // Assert
      await waitFor(() => {
        expect(cloudButton).not.toHaveAttribute("data-test-state", "loading");
        expect(oidcButton).toHaveAttribute("data-test-state", "loading");
      });
    });
  });
});
