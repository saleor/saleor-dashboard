import { type ChannelData } from "@dashboard/channels/utils";
import { ThemeWrapper } from "@test/themeWrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import type * as React from "react";

import { ProductVariantPrice } from "./ProductVariantPrice";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeWrapper>{children}</ThemeWrapper>
);

const listing: ChannelData[] = [
  {
    id: "1",
    name: "Channel-USD",
    currency: "USD",
    price: "",
    costPrice: "",
  },
];

describe("ProductVariantPrice", () => {
  it("should render empty state when variant is not assigned to any channel", () => {
    // Arrange
    render(<ProductVariantPrice errors={[]} productVariantChannelListings={[]} />, { wrapper });

    // Assert
    expect(
      screen.getByText("Add channels in the Channels section to set prices"),
    ).toBeInTheDocument();
  });

  it("should render manage channels button and variant-specific empty state", () => {
    // Arrange
    const onManageClick = jest.fn();

    render(
      <ProductVariantPrice
        errors={[]}
        productVariantChannelListings={[]}
        onManageClick={onManageClick}
        availableChannelsCount={2}
      />,
      { wrapper },
    );

    // Assert
    expect(screen.getByText("Choose channels to set selling and cost prices.")).toBeInTheDocument();
    expect(screen.getByText("Listed on 0 of 2 channels")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("manage-channels-button"));
    expect(onManageClick).toHaveBeenCalled();
  });

  it("should render product-level empty state when the product has no channels", () => {
    // Arrange
    render(
      <ProductVariantPrice
        errors={[]}
        productVariantChannelListings={[]}
        onManageClick={jest.fn()}
        availableChannelsCount={0}
      />,
      { wrapper },
    );

    // Assert
    expect(
      screen.getByText("Add channels on the product page before listing this variant."),
    ).toBeInTheDocument();
  });

  it("should not show simple-product empty copy while variant data is loading", () => {
    // Arrange
    render(
      <ProductVariantPrice errors={[]} productVariantChannelListings={[]} disabled loading />,
      { wrapper },
    );

    // Assert
    expect(
      screen.queryByText("Add channels in the Channels section to set prices"),
    ).not.toBeInTheDocument();
  });

  it("should render channel count subtitle when channels are assigned", () => {
    // Arrange
    render(
      <ProductVariantPrice
        errors={[]}
        productVariantChannelListings={listing}
        onManageClick={jest.fn()}
        availableChannelsCount={2}
      />,
      { wrapper },
    );

    // Assert
    expect(screen.getByText("Listed on 1 of 2 channels")).toBeInTheDocument();
    expect(screen.getByTestId("manage-channels-button")).toBeInTheDocument();
  });

  it("should allow to display 0 value", () => {
    // Arrange
    const zeroListing: ChannelData[] = [
      {
        id: "1",
        name: "Channel-USD",
        currency: "USD",
        price: "0",
        costPrice: "",
      },
    ];

    render(<ProductVariantPrice errors={[]} productVariantChannelListings={zeroListing} />, {
      wrapper,
    });

    // Assert
    expect(screen.getByTestId("price-field")).toHaveValue("0.00");
  });

  it("should allow to set price value", () => {
    // Arrange
    const onChange = jest.fn();

    render(
      <ProductVariantPrice
        errors={[]}
        productVariantChannelListings={listing}
        onChange={onChange}
      />,
      {
        wrapper,
      },
    );

    const input = screen.getByTestId("price-field");

    // Act
    fireEvent.change(input, { target: { value: "12.50" } });

    // Assert
    expect(onChange).toHaveBeenCalledWith("1", {
      price: "12.50",
      costPrice: "",
    });
  });

  it("should render channel status indicator", () => {
    // Arrange
    const channels: ChannelData[] = [
      {
        id: "1",
        name: "Channel-USD",
        currency: "USD",
        price: "10",
        costPrice: "",
        isActive: false,
        isPublished: true,
      },
    ];

    render(<ProductVariantPrice errors={[]} productVariantChannelListings={channels} />, {
      wrapper,
    });

    // Assert
    expect(screen.getByTestId("channel-availability-icon")).toBeInTheDocument();
  });

  it("should paste tab-separated selling and cost prices down the list", () => {
    // Arrange
    const onChannelsReplace = jest.fn();
    const channels: ChannelData[] = [
      {
        id: "1",
        name: "Channel-USD",
        currency: "USD",
        price: "",
        costPrice: "",
      },
      {
        id: "2",
        name: "Channel-EUR",
        currency: "EUR",
        price: "",
        costPrice: "",
      },
    ];

    render(
      <ProductVariantPrice
        errors={[]}
        productVariantChannelListings={channels}
        onChannelsReplace={onChannelsReplace}
      />,
      { wrapper },
    );

    const sellingPriceInput = screen.getAllByTestId("price-field")[0];

    // Act
    fireEvent.paste(sellingPriceInput, {
      clipboardData: {
        getData: () => "45\t4\n80\t30",
      },
    });

    // Assert — rows are sorted by channel name (EUR before USD)
    expect(onChannelsReplace).toHaveBeenCalledWith([
      {
        id: "2",
        name: "Channel-EUR",
        currency: "EUR",
        price: "45.00",
        costPrice: "4.00",
      },
      {
        id: "1",
        name: "Channel-USD",
        currency: "USD",
        price: "80.00",
        costPrice: "30.00",
      },
    ]);
  });
});
