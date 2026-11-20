import { OrderErrorCode, type OrderErrorFragment } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderVoucherDialog, type VoucherInputMode } from "./OrderVoucherDialog";

// DynamicCombobox uses IntersectionObserver for infinite scroll.
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const pickerMode: VoucherInputMode = {
  kind: "picker",
  options: [{ value: "SUMMER10", label: "SUMMER10" }],
  onSearch: jest.fn(),
  fetchMore: { loading: false, hasMore: false, onFetchMore: jest.fn() },
};

const manualMode: VoucherInputMode = { kind: "manual" };

const invalidCodeError: OrderErrorFragment = {
  __typename: "OrderError",
  code: OrderErrorCode.INVALID_VOUCHER_CODE,
  field: "voucherCode",
  addressType: null,
  message: "Voucher code is invalid.",
  orderLines: null,
};

const renderDialog = ({
  mode,
  onSubmit = jest.fn(),
  errors = [],
}: {
  mode: VoucherInputMode;
  onSubmit?: (voucherCode: string) => void;
  errors?: OrderErrorFragment[];
}) =>
  render(
    <OrderVoucherDialog
      open
      mode={mode}
      currentCode={null}
      confirmButtonState="default"
      errors={errors}
      onClose={jest.fn()}
      onSubmit={onSubmit}
    />,
    { wrapper: Wrapper },
  );

describe("OrderVoucherDialog", () => {
  it("lets staff with discount access pick a code from the search", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({ mode: pickerMode, onSubmit });

    // Act
    await user.click(screen.getByTestId("voucher-code-picker"));
    await user.click(screen.getByText("SUMMER10"));
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(screen.queryByTestId("voucher-code-input")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith("SUMMER10");
  });

  it("asks staff without discount access to type the code", async () => {
    // Arrange
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    renderDialog({ mode: manualMode, onSubmit });

    // Act
    await user.type(screen.getByTestId("voucher-code-input"), "  WINTER5 ");
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(screen.queryByTestId("voucher-code-picker")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith("WINTER5");
  });

  it("keeps Apply disabled until a code is entered", () => {
    // Arrange & Act
    renderDialog({ mode: manualMode });

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("shows the API error inline", () => {
    // Arrange & Act
    renderDialog({ mode: manualMode, errors: [invalidCodeError] });

    // Assert
    expect(screen.getByText("Voucher code is invalid.")).toBeInTheDocument();
  });

  it("shows an empty state when the search finds no codes", () => {
    // Arrange & Act
    renderDialog({ mode: { ...pickerMode, options: [] } });

    // Assert
    expect(
      screen.getByText("No active vouchers match your search in this channel."),
    ).toBeInTheDocument();
  });
});
