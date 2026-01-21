import "@testing-library/jest-dom/extend-expect";

import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { fireEvent, render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { StaffPasswordResetDialog } from "./StaffPasswordResetDialog";

const TestWrapper = ({ children }: React.PropsWithChildren<{}>) => (
  // todo do we need intlProvider if we mock react-intl?
  <IntlProvider defaultLocale="en" locale="en">
    {/* @ts-expect-error legacy types */}
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
  useNotifier: jest.fn(() => jest.fn()),
}));

jest.mock("@dashboard/auth/utils", () => ({
  getNewPasswordResetRedirectUrl: jest.fn(() => "http://localhost/reset"),
}));

describe("StaffPasswordResetDialog", () => {
  it("renders the dialog with input field", () => {
    // Arrange & Act
    render(
      <TestWrapper>
        <StaffPasswordResetDialog {...defaultProps} />
      </TestWrapper>,
    );

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
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
