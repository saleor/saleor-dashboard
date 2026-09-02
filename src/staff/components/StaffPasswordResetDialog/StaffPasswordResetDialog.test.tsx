import "@testing-library/jest-dom/extend-expect";

import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { StaffPasswordResetDialog } from "./StaffPasswordResetDialog";

const TestWrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <IntlProvider defaultLocale="en" locale="en">
    <ThemeProvider>{children}</ThemeProvider>
  </IntlProvider>
);

const defaultProps = {
  open: true,
  onClose: jest.fn(),
};

const mockResetPassword = jest.fn();
const currentEmail = "test@example.com";

jest.mock("@dashboard/graphql", () => ({
  useRequestPasswordResetMutation: jest.fn(() => [mockResetPassword, { status: "default" }]),
}));

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: jest.fn(() => jest.fn()),
}));

jest.mock("@dashboard/auth/utils", () => ({
  getNewPasswordResetRedirectUrl: jest.fn(() => "http://localhost/reset"),
}));

jest.mock("@dashboard/auth/useUser", () => ({
  useUser: (): { user: { email: string } } => ({ user: { email: currentEmail } }),
}));

describe("StaffPasswordResetDialog", () => {
  beforeEach(() => {
    mockResetPassword.mockClear();
  });

  it("keeps Reset disabled until the email matches the signed-in account", () => {
    // Arrange & Act
    render(
      <TestWrapper>
        <StaffPasswordResetDialog {...defaultProps} />
      </TestWrapper>,
    );

    const submitButton = screen.getByTestId("submit");
    const emailInput = screen.getByTestId("email");

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Act
    fireEvent.change(emailInput, {
      target: { value: "other@example.com" },
    });

    // Assert
    expect(submitButton).toBeDisabled();
  });

  it("submits the account email when the typed value matches", () => {
    // Arrange
    render(
      <TestWrapper>
        <StaffPasswordResetDialog {...defaultProps} />
      </TestWrapper>,
    );

    const submitButton = screen.getByTestId("submit");
    const emailInput = screen.getByTestId("email");

    // Act
    fireEvent.change(emailInput, {
      target: { value: "Test@Example.com" },
    });

    // Assert
    expect(submitButton).toBeEnabled();

    // Act
    fireEvent.click(submitButton);

    // Assert
    expect(mockResetPassword).toHaveBeenCalledWith({
      variables: {
        email: currentEmail,
        redirectUrl: "http://localhost/reset",
      },
    });
  });
});
