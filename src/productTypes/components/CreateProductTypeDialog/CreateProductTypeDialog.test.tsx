import { ProductTypeKindEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateProductTypeDialog } from "./CreateProductTypeDialog";

const defaultProps = {
  open: true,
  confirmButtonState: "default" as const,
  errors: [],
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("CreateProductTypeDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a regular product type from name", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateProductTypeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    // Act
    await user.type(screen.getByTestId("product-type-name-input"), "T-shirt");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "T-shirt",
      kind: ProductTypeKindEnum.NORMAL,
    });
  });

  it("creates a gift card product type when that kind is selected", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateProductTypeDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    // Act
    await user.type(screen.getByTestId("product-type-name-input"), "Store credit");
    await user.click(screen.getByTestId("GIFT_CARD"));
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Store credit",
      kind: ProductTypeKindEnum.GIFT_CARD,
    });
  });

  it("disables create until a name is set", () => {
    // Arrange & Act
    render(<CreateProductTypeDialog {...defaultProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });
});
