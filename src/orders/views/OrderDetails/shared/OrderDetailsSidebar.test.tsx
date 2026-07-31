import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { OrderDetailsSidebar } from "./OrderDetailsSidebar";

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({ ORDER_DETAILS_MORE_ACTIONS: [], ORDER_DETAILS_WIDGETS: [] }),
}));

const renderSidebar = (invoices?: ReactNode) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <OrderDetailsSidebar
          order={OrderFixture.fulfilled().build()}
          errors={[]}
          onBillingAddressEdit={jest.fn()}
          onShippingAddressEdit={jest.fn()}
          onProfileView={jest.fn()}
          invoices={invoices}
        />
      </MemoryRouter>
    </Wrapper>,
  );

describe("OrderDetailsSidebar", () => {
  it("renders the invoice slot when a lifecycle supplies one", () => {
    // Act
    renderSidebar(<div data-test-id="invoice-slot" />);

    // Assert
    expect(screen.getByTestId("invoice-slot")).toBeInTheDocument();
  });

  it("omits the invoice slot for lifecycles that have no invoices", () => {
    // Act
    renderSidebar();

    // Assert
    expect(screen.queryByTestId("invoice-slot")).not.toBeInTheDocument();
  });
});
