import { DevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { OrderStatus } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { OrderDetailsHeader } from "./OrderDetailsHeader";

jest.mock("@dashboard/extensions/hooks/useExtensions", () => ({
  useExtensions: () => ({ ORDER_DETAILS_MORE_ACTIONS: [], ORDER_DETAILS_WIDGETS: [] }),
}));

const devMode = {
  variables: "",
  setVariables: jest.fn(),
  isDevModeVisible: false,
  setDevModeVisibility: jest.fn(),
  devModeContent: "",
  setDevModeContent: jest.fn(),
};

const renderHeader = (status: OrderStatus) =>
  render(
    <Wrapper>
      <MemoryRouter>
        <DevModeContext.Provider value={devMode}>
          <OrderDetailsHeader
            order={{ ...OrderFixture.fulfilled().build(), status }}
            onShowMetadata={jest.fn()}
            onCancel={jest.fn()}
          />
        </DevModeContext.Provider>
      </MemoryRouter>
    </Wrapper>,
  );

describe("OrderDetailsHeader", () => {
  it("offers cancelling an order that is not canceled yet", async () => {
    // Arrange
    renderHeader(OrderStatus.FULFILLED);

    // Act
    await userEvent.click(screen.getByTestId("show-more-button"));

    // Assert
    expect(await screen.findByTestId("cancel-order")).toBeInTheDocument();
  });

  it("hides the cancel action for an already canceled order", async () => {
    // Arrange
    renderHeader(OrderStatus.CANCELED);

    // Act
    await userEvent.click(screen.getByTestId("show-more-button"));

    // Assert
    expect(await screen.findByTestId("graphiql-redirect")).toBeInTheDocument();
    expect(screen.queryByTestId("cancel-order")).not.toBeInTheDocument();
  });
});
