import { AvailableExternalAuthenticationsQuery } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

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
  onExternalAuthentication: jest.fn(),
  onSubmit: jest.fn(),
};

const renderLoginPage = (props = {}) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <LoginPage lastLoginMethod={null} {...defaultProps} {...props} />
      </MemoryRouter>
    </Wrapper>,
  );

describe("LoginPage", () => {
  describe("External Authentication", () => {
    it("renders external authentication buttons when provided", () => {
      // Arrange & Act
      renderLoginPage();

      // Assert
      expect(screen.getByTestId("external-authentication")).toBeInTheDocument();
    });

    it("does not render external authentication buttons when empty array", () => {
      // Arrange & Act
      renderLoginPage({ externalAuthentications: [] });

      // Assert
      expect(screen.queryByTestId("external-authentication")).not.toBeInTheDocument();
    });

    it("does not render external authentication buttons when undefined", () => {
      // Arrange & Act
      renderLoginPage({ externalAuthentications: undefined });

      // Assert
      expect(screen.queryByTestId("external-authentication")).not.toBeInTheDocument();
    });

    it("renders 'Continue with Saleor Cloud' for cloud auth plugin", () => {
      // Arrange
      const cloudAuth = {
        id: "cloud_auth.CloudAuthorizationPlugin",
        name: "Cloud Auth",
        __typename: "ExternalAuthentication",
      } as AuthType[0];

      // Act
      renderLoginPage({ externalAuthentications: [cloudAuth] });

      // Assert
      expect(screen.getByText("Continue with Saleor Cloud")).toBeInTheDocument();
    });

    it("sets optimisticLoaderAuthId when clicking external auth button", async () => {
      // Arrange & Act
      renderLoginPage();

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
      renderLoginPage({ externalAuthentications: twoAuths });

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
