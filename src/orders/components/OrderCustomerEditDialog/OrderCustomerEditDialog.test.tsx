import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderCustomerEditDialog } from "./OrderCustomerEditDialog";

jest.mock("../OrderCustomer/CustomerEditForm", () => ({
  CustomerEditForm: ({
    onChange,
  }: {
    onChange: (option: { label: string; value: string } | null) => void;
  }) => (
    <button
      type="button"
      data-test-id="select-customer-option"
      onClick={() => onChange({ label: "user2@example.com", value: "user-2" })}
    >
      Select customer
    </button>
  ),
}));

describe("OrderCustomerEditDialog", () => {
  const order = OrderFixture.fulfilled().build();

  const defaultProps = {
    confirmButtonState: "default" as ConfirmButtonTransitionState,
    errors: [],
    open: true,
    order,
    onClose: jest.fn(),
    onCustomerEdit: jest.fn(),
    hasMore: false,
    onFetchMore: jest.fn(),
  };

  it("renders change customer dialog with customer search form", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderCustomerEditDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("change-customer-dialog")).toBeInTheDocument();
    expect(screen.getByText("Change customer")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Search for an existing customer or enter an email address to assign to this draft order.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("select-customer-option")).toBeInTheDocument();
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("submits selected customer when confirm is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onCustomerEdit = jest.fn();

    render(
      <Wrapper>
        <OrderCustomerEditDialog {...defaultProps} onCustomerEdit={onCustomerEdit} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("select-customer-option"));

    const submitButton = screen.getByTestId("submit");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.click(submitButton);

    // Assert
    expect(onCustomerEdit).toHaveBeenCalledWith({
      prevUser: order.user?.id,
      prevUserEmail: order.userEmail,
      user: "user-2",
    });
  });

  it("does not show stale mutation success state before submit", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <OrderCustomerEditDialog {...defaultProps} confirmButtonState="success" />
      </Wrapper>,
    );

    // Assert
    expect(screen.queryByTestId("button-success")).not.toBeInTheDocument();
  });

  it("shows loading state after submit", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <Wrapper>
        <OrderCustomerEditDialog {...defaultProps} confirmButtonState="loading" />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("select-customer-option"));

    const submitButton = screen.getByTestId("submit");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
    fireEvent.click(submitButton);

    // Assert
    expect(screen.getByTestId("button-progress")).toBeInTheDocument();
  });

  it("displays error messages when provided", () => {
    // Arrange
    const errors = [{ code: OrderErrorCode.GRAPHQL_ERROR }] as unknown as OrderErrorFragment[];

    // Act
    render(
      <Wrapper>
        <OrderCustomerEditDialog {...defaultProps} errors={errors} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getAllByTestId("dialog-error")).toHaveLength(1);
  });
});
