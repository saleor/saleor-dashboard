import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { orderLineSearch } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderProductAddDialog } from "./OrderProductAddDialog";

describe("OrderProductAddDialog", () => {
  const placeholderImage = "https://via.placeholder.com/64";
  const products = orderLineSearch(placeholderImage);

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    products,
    loading: false,
    hasMore: false,
    channelName: "Channel-PLN",
    onClose: jest.fn(),
    onFetch: jest.fn(),
    onFetchMore: jest.fn(),
    onSubmit: jest.fn(),
  };

  it("renders picker layout with title, subtitle, search, and product list", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByText(/Add product from/)).toBeInTheDocument();
    expect(
      screen.getByText("You can only add products available for the order's channel"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("search-query")).toBeInTheDocument();
    expect(screen.getByTestId("add-products-table")).toBeInTheDocument();
    expect(screen.getAllByTestId("product").length).toBeGreaterThan(0);
    expect(screen.getByTestId("confirm-button")).toBeDisabled();
  });

  it("submits selected variants when confirm is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(
      <Wrapper>
        <OrderProductAddDialog {...defaultProps} onSubmit={onSubmit} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getAllByRole("checkbox")[1]);

    const confirmButton = screen.getByTestId("confirm-button");

    await waitFor(() => {
      expect(confirmButton).not.toBeDisabled();
    });
    fireEvent.click(confirmButton);

    const firstVariantId = products?.[0]?.variants?.[0]?.id;

    // Assert
    expect(onSubmit).toHaveBeenCalledWith([expect.objectContaining({ id: firstVariantId })]);
  });
});
