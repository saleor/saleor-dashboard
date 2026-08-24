import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateCustomerTypeDialog } from "./CreateCustomerTypeDialog";

const defaultProps = {
  open: true,
  confirmButtonState: "default" as const,
  errors: [],
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("CreateCustomerTypeDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a customer type from name", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateCustomerTypeDialog {...defaultProps} onSubmit={onSubmit} />, {
      wrapper: Wrapper,
    });

    // Act
    await user.type(screen.getByTestId("customer-type-name-input"), "B2B");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "B2B",
    });
  });

  it("disables create until a name is set", () => {
    // Arrange & Act
    render(<CreateCustomerTypeDialog {...defaultProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("trims the name before submit", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateCustomerTypeDialog {...defaultProps} onSubmit={onSubmit} />, {
      wrapper: Wrapper,
    });

    // Act
    await user.type(screen.getByTestId("customer-type-name-input"), "  B2B  ");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "B2B",
    });
  });
});
