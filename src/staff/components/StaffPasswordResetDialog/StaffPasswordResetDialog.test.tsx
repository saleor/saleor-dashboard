import "@testing-library/jest-dom/extend-expect";

import { fireEvent, render, screen } from "@testing-library/react";

import StaffPasswordResetDialog, {
  StaffPasswordResetDialogProps,
} from "./StaffPasswordResetDialog";

const defaultProps = {
  confirmButtonState: "default",
  errors: [],
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
} as StaffPasswordResetDialogProps;

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: any }) => <>{defaultMessage}</>,
}));

describe("StaffPasswordResetDialog", () => {
  it("renders the form", () => {
    // Arrange & Act
    render(<StaffPasswordResetDialog {...defaultProps} />);

    // Assert
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("executes onSubmit when submit button is clicked", () => {
    // Arrange
    const { getByTestId } = render(<StaffPasswordResetDialog {...defaultProps} />);

    const submitButton = screen.getByTestId("submit");
    const oldPasswordInput = getByTestId("old-password-input").querySelector("input");
    const newPasswordInput = getByTestId("new-password-input").querySelector("input");

    // Act
    fireEvent.change(oldPasswordInput!, {
      target: { value: "old-password" },
    });
    fireEvent.change(newPasswordInput!, {
      target: { value: "new-password" },
    });
    fireEvent.click(submitButton);

    // Assert
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      oldPassword: "old-password",
      newPassword: "new-password",
    });
  });
});
