import { channelsList } from "@dashboard/channels/fixtures";
import { channelUsabilityData, order } from "@dashboard/orders/fixtures";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import OrderDraftDetails from "./OrderDraftDetails";

// Mock the child component to avoid needing complex context providers
jest.mock("../OrderDraftDetailsProducts/OrderDraftDetailsProducts", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-order-draft-details-products" />,
}));

describe("OrderDraftDetails", () => {
  const defaultProps = {
    order: order("--placeholder--"),
    channelUsabilityData,
    errors: [],
    loading: false,
    onOrderLineAdd: jest.fn(),
    onOrderLineChange: jest.fn(),
    onOrderLineRemove: jest.fn(),
    onOrderLineShowMetadata: jest.fn(),
  };

  it("renders Add products button enabled with channel tooltip when channel is active and has products", () => {
    // Arrange
    render(
      <Wrapper>
        <OrderDraftDetails {...defaultProps} />
      </Wrapper>,
    );

    // Act
    const button = screen.getByTestId("add-products-button");

    // Assert
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    // Note: intl formatMessage in test env may not interpolate, so we check for the pattern
    expect(button.getAttribute("title")).toMatch(/Add products from/);
  });

  it("renders Add products button disabled with tooltip when channel is inactive", () => {
    // Arrange
    const inactiveChannelOrder = {
      ...order("--placeholder--"),
      channel: { ...channelsList[0], isActive: false },
    };

    render(
      <Wrapper>
        <OrderDraftDetails {...defaultProps} order={inactiveChannelOrder} />
      </Wrapper>,
    );

    // Act
    const button = screen.getByTestId("add-products-button");

    // Assert
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "Orders cannot be placed in an inactive channel.");
  });

  it("renders Add products button disabled with tooltip when no products in channel", () => {
    // Arrange
    const noProductsChannelData = {
      ...channelUsabilityData,
      products: { totalCount: 0, __typename: "ProductCountableConnection" as const },
    };

    render(
      <Wrapper>
        <OrderDraftDetails {...defaultProps} channelUsabilityData={noProductsChannelData} />
      </Wrapper>,
    );

    // Act
    const button = screen.getByTestId("add-products-button");

    // Assert
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "There are no available products in this channel.");
  });

  it("shows inactive channel tooltip when both channel is inactive and no products", () => {
    // Arrange
    const inactiveChannelOrder = {
      ...order("--placeholder--"),
      channel: { ...channelsList[0], isActive: false },
    };
    const noProductsChannelData = {
      ...channelUsabilityData,
      products: { totalCount: 0, __typename: "ProductCountableConnection" as const },
    };

    render(
      <Wrapper>
        <OrderDraftDetails
          {...defaultProps}
          order={inactiveChannelOrder}
          channelUsabilityData={noProductsChannelData}
        />
      </Wrapper>,
    );

    // Act
    const button = screen.getByTestId("add-products-button");

    // Assert
    expect(button).toBeDisabled();
    // Inactive channel takes precedence
    expect(button).toHaveAttribute("title", "Orders cannot be placed in an inactive channel.");
  });
});
