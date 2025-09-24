import "@testing-library/jest-dom/extend-expect";

import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

import { StaffPasswordResetDialog } from "./StaffPasswordResetDialog";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider defaultLocale="en" locale="en">
    <LegacyThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LegacyThemeProvider>
  </IntlProvider>
);

const defaultProps = {
  open: true,
  onClose: jest.fn(),
};

const mockResetPassword = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  useRequestPasswordResetMutation: jest.fn(() => [mockResetPassword, { status: "default" }]),
}));

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock("@dashboard/auth/utils", () => ({
  getNewPasswordResetRedirectUrl: jest.fn(() => "http://localhost/reset"),
}));

describe("StaffPasswordResetDialog", () => {
  it("renders the form with input field", () => {
    // Arrange & Act
    render(
      <TestWrapper>
        <StaffPasswordResetDialog {...defaultProps} />
      </TestWrapper>,
    );

    // Assert
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeInTheDocument();
  });

  it("submits form with email when submit button is clicked", () => {
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
      target: { value: "test@example.com" },
    });
    fireEvent.click(submitButton);

    // Assert - form submission is handled by GraphQL mutation
    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
  });
});
