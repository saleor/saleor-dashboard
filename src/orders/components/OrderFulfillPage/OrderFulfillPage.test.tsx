import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { orderToFulfill } from "./fixtures";
import OrderFulfillPage from "./OrderFulfillPage";

jest.mock(
  "@dashboard/orders/components/OrderChangeWarehouseDialog/OrderChangeWarehouseDialog",
  () => ({
    OrderChangeWarehouseDialog: ({ line }: { line: { productName: string } }) => (
      <div data-test-id="change-warehouse-dialog">{line.productName}</div>
    ),
  }),
);

const defaultProps = {
  loading: false,
  errors: [],
  order: orderToFulfill,
  saveButtonBar: "default" as ConfirmButtonTransitionState,
  onSubmit: jest.fn(),
  openModal: jest.fn(),
  closeModal: jest.fn(),
};

const renderPage = (params = {}) =>
  render(
    <MemoryRouter>
      <Wrapper>
        <SavebarRefProvider>
          <OrderFulfillPage {...defaultProps} params={params} />
        </SavebarRefProvider>
      </Wrapper>
    </MemoryRouter>,
  );

describe("OrderFulfillPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keeps every order line visible while changing a warehouse", () => {
    // Arrange
    const warehouseLineId = orderToFulfill.lines[0].id;

    // Act
    renderPage({
      action: "change-warehouse",
      warehouseLineId,
      warehouseId: orderToFulfill.lines[0].variant?.stocks?.[0]?.warehouse.id,
    });

    // Assert
    expect(screen.getAllByText("T-Shirt")).toHaveLength(2);
    expect(screen.getByText("Lemon Juice")).toBeInTheDocument();
    expect(screen.getByText("Orange Juice")).toBeInTheDocument();
    expect(screen.getByText("Items ready to ship")).toBeInTheDocument();
    expect(screen.queryByText(/Opened from the line matrix/)).not.toBeInTheDocument();
  });

  it("still limits fulfillment when deliberately opened from the line matrix", () => {
    // Arrange
    const lineId = orderToFulfill.lines[0].id;

    // Act
    renderPage({ lineId });

    // Assert
    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    expect(screen.queryByText("Lemon Juice")).not.toBeInTheDocument();
    expect(screen.queryByText("Orange Juice")).not.toBeInTheDocument();
    expect(screen.getByText(/Opened from the line matrix/)).toBeInTheDocument();
  });

  it("opens the warehouse picker with its own line parameter", () => {
    // Arrange
    renderPage();

    const warehouseInputs = screen.getAllByTestId("select-warehouse-button");

    // Act
    fireEvent.click(warehouseInputs[1]);

    // Assert
    expect(defaultProps.openModal).toHaveBeenCalledWith(
      "change-warehouse",
      expect.objectContaining({
        warehouseLineId: orderToFulfill.lines[1].id,
      }),
    );
    expect(defaultProps.openModal.mock.calls[0][1]).not.toHaveProperty("lineId");
  });
});
