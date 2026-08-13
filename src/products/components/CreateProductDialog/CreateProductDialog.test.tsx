import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreateProductDialog, type ProductTypeChoice } from "./CreateProductDialog";
import { messages } from "./messages";

// DynamicCombobox uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

const beerType: ProductTypeChoice = {
  label: "Beer",
  value: "pt-beer",
  hasVariants: true,
};

const defaultProps = {
  open: true,
  confirmButtonState: "default" as const,
  errors: [],
  productTypes: [beerType],
  fetchProductTypes: jest.fn(),
  fetchMoreProductTypes: { loading: false, hasMore: false, onFetchMore: jest.fn() },
  onClose: jest.fn(),
  onSubmit: jest.fn().mockResolvedValue([]),
};

describe("CreateProductDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a product with name and type", async () => {
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<CreateProductDialog {...defaultProps} onSubmit={onSubmit} />, { wrapper: Wrapper });

    // Act
    await user.type(screen.getByTestId("product-name-input"), "Bean Juice");
    await user.click(screen.getByTestId("dialog-product-type"));
    await user.click(screen.getByText("Beer"));
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Bean Juice",
      productTypeId: "pt-beer",
      hasVariants: true,
    });
  });

  it("disables create until name and type are set", () => {
    // Arrange & Act
    render(<CreateProductDialog {...defaultProps} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows create product type CTA when the shop has no types", () => {
    // Arrange & Act
    render(<CreateProductDialog {...defaultProps} productTypes={[]} />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByTestId("product-type-picker-empty")).toBeInTheDocument();
    expect(screen.getByText(messages.emptyTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId("create-product-type")).toBeInTheDocument();
    expect(screen.queryByTestId("product-name-input")).not.toBeInTheDocument();
  });

  it("keeps the create form when type search later returns no matches", () => {
    // Arrange
    const { rerender } = render(<CreateProductDialog {...defaultProps} />, { wrapper: Wrapper });

    expect(screen.getByTestId("product-name-input")).toBeInTheDocument();

    // Act — combobox search miss (or cleared query before the unfiltered refetch)
    rerender(<CreateProductDialog {...defaultProps} productTypes={[]} />);

    // Assert
    expect(screen.getByTestId("product-name-input")).toBeInTheDocument();
    expect(screen.queryByTestId("product-type-picker-empty")).not.toBeInTheDocument();
  });

  it("does not flash the empty-shop screen when reopening after a search miss", () => {
    // Arrange
    const { rerender } = render(<CreateProductDialog {...defaultProps} />, { wrapper: Wrapper });

    // Act — close with a cached empty search, then open again
    rerender(<CreateProductDialog {...defaultProps} open={false} productTypes={[]} />);
    rerender(<CreateProductDialog {...defaultProps} open productTypes={[]} />);

    // Assert
    expect(screen.getByTestId("product-name-input")).toBeInTheDocument();
    expect(screen.queryByTestId("product-type-picker-empty")).not.toBeInTheDocument();
  });
});
