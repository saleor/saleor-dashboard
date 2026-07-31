import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { type OrderUrlQueryParams } from "@dashboard/orders/urls";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { OrderCommonDialogs } from "./OrderCommonDialogs";

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<object>("@dashboard/graphql"),
  useWarehouseListQuery: () => ({ data: undefined }),
  useCustomerAddressesQuery: () => ({ data: undefined, loading: false }),
}));

const order = OrderFixture.fulfilled().build();
const countries = [{ __typename: "CountryDisplay" as const, code: "PL", country: "Poland" }];

const mutation = () => ({
  mutate: jest.fn(() => Promise.resolve({ data: undefined })),
  opts: { status: "default", data: undefined },
});

const renderDialogs = (params: OrderUrlQueryParams, orderOverride = order) => {
  const operations = {
    orderCancel: mutation(),
    orderUpdate: mutation(),
    orderFulfillmentCancel: mutation(),
    orderFulfillmentUpdateTracking: mutation(),
    orderInvoiceSend: mutation(),
  };

  render(
    <MemoryRouter>
      <Wrapper>
        <OrderCommonDialogs
          orderId={orderOverride.id}
          order={orderOverride}
          countries={countries}
          params={params}
          onClose={jest.fn()}
          operations={operations as never}
        />
      </Wrapper>
    </MemoryRouter>,
  );

  return operations;
};

describe("OrderCommonDialogs", () => {
  const cannotCancelTitle = "Saleor couldn\u2019t cancel order";

  it("offers cancelling an order that has no fulfilled shipments", () => {
    // Arrange
    const cancellable = OrderFixture.unfulfilled().build();

    // Act
    renderDialogs({ action: "cancel" }, cancellable);

    // Assert
    expect(screen.getByTestId("submit")).toBeInTheDocument();
    expect(screen.queryByText(cannotCancelTitle)).not.toBeInTheDocument();
  });

  it("refuses to cancel an order that already has a fulfilled shipment", () => {
    // Arrange // Act — the fulfilled fixture carries a FULFILLED fulfillment
    renderDialogs({ action: "cancel" });

    // Assert
    expect(screen.getByText(cannotCancelTitle)).toBeInTheDocument();
    expect(screen.queryByTestId("submit")).not.toBeInTheDocument();
  });

  it("cancels the order through the passed mutation", async () => {
    // Arrange
    const cancellable = OrderFixture.unfulfilled().build();
    const operations = renderDialogs({ action: "cancel" }, cancellable);

    // Act
    await userEvent.click(screen.getByTestId("submit"));

    // Assert
    expect(operations.orderCancel.mutate).toHaveBeenCalledWith({ id: cancellable.id });
  });

  it("renders nothing until the order has loaded", () => {
    // Arrange // Act
    render(
      <MemoryRouter>
        <Wrapper>
          <OrderCommonDialogs
            orderId="order-id"
            order={undefined}
            countries={countries}
            params={{ action: "cancel" }}
            onClose={jest.fn()}
            operations={{} as never}
          />
        </Wrapper>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
