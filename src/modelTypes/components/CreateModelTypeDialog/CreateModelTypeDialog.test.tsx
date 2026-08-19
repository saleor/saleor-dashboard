import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateModelTypeDialog } from "./CreateModelTypeDialog";

const defaultProps = {
  open: true,
  confirmButtonState: "default" as const,
  errors: [],
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("CreateModelTypeDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a model type from name", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateModelTypeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    // Act
    await user.type(screen.getByTestId("page-type-name-input"), "Blog post");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Blog post",
    });
  });

  it("disables create until a name is set", () => {
    // Arrange & Act
    render(<CreateModelTypeDialog {...defaultProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("trims the name before submit", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateModelTypeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    // Act
    await user.type(screen.getByTestId("page-type-name-input"), "  Blog post  ");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Blog post",
    });
  });
});
