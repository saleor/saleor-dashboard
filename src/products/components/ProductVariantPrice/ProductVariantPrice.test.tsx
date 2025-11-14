import { ChannelData } from "@dashboard/channels/utils";
import { ProductErrorCode } from "@dashboard/graphql";
import { ThemeWrapper } from "@test/themeWrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { ProductVariantPrice } from "./ProductVariantPrice";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeWrapper>{children}</ThemeWrapper>
);

describe("ProductVariantPrice", () => {
  it("should render not assign info text when variant is not assigned to any channel", () => {
    // Arrange
    render(<ProductVariantPrice errors={[]} productVariantChannelListings={[]} />, { wrapper });

    // Assert
    expect(
      screen.getByText(
        "Assign this variant to a channel in the product channel manager to define prices",
      ),
    ).toBeInTheDocument();
  });

  it("should allow to display 0 value", async () => {
    // Arrange
    const listing = [
      {
        id: "1",
        currency: "USD",
        price: 0,
        priorPrice: "",
        preorderThreshold: 0,
      },
    ] as unknown as ChannelData[];

    render(<ProductVariantPrice errors={[]} productVariantChannelListings={listing} />, {
      wrapper,
    });

    // Assert
    expect(screen.getByTestId("price-field")).toHaveValue(0);
  });

  it("should allow to set price value", () => {
    // Arrange
    const onChange = jest.fn();
    const listing = [
      {
        id: "1",
        currency: "USD",
        price: "",
        priorPrice: "",
        preorderThreshold: 0,
      },
    ] as unknown as ChannelData[];

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
    fireEvent.change(input, { target: { value: 0 } });

    // Assert
    expect(onChange).toHaveBeenCalledWith("1", {
      price: 0,
      priorPrice: "",
      preorderThreshold: 0,
      costPrice: undefined,
    });
  });

  it("should allow to set prior price value", () => {
    // Arrange
    const onChange = jest.fn();
    const listing: ChannelData[] = [
      {
        id: "1",
        name: "USD Channel",
        currency: "USD",
        price: "100",
        priorPrice: "",
        costPrice: "50",
        preorderThreshold: 0,
      },
    ];

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

    const input = screen.getByTestId("prior-price-field");

    // Act
    fireEvent.change(input, { target: { value: "150" } });

    // Assert
    expect(onChange).toHaveBeenCalledWith("1", {
      price: "100",
      priorPrice: 150,
      costPrice: "50",
      preorderThreshold: 0,
    });
  });

  it("should display prior price field with correct value", () => {
    // Arrange
    const listing: ChannelData[] = [
      {
        id: "1",
        name: "USD Channel",
        currency: "USD",
        price: "100",
        priorPrice: "150",
        costPrice: "50",
        preorderThreshold: 0,
      },
    ];

    render(<ProductVariantPrice errors={[]} productVariantChannelListings={listing} />, {
      wrapper,
    });

    // Assert
    const priorPriceInput = screen.getByTestId("prior-price-field");

    expect(priorPriceInput).toHaveValue(150);
  });

  it("should render Prior Price column header", () => {
    // Arrange
    const listing: ChannelData[] = [
      {
        id: "1",
        name: "USD Channel",
        currency: "USD",
        price: "100",
        priorPrice: "150",
        costPrice: "50",
        preorderThreshold: 0,
      },
    ];

    render(<ProductVariantPrice errors={[]} productVariantChannelListings={listing} />, {
      wrapper,
    });

    // Assert
    expect(screen.getByText("Prior Price")).toBeInTheDocument();
  });

  it("should handle empty prior price value", () => {
    // Arrange
    const onChange = jest.fn();
    const listing: ChannelData[] = [
      {
        id: "1",
        name: "USD Channel",
        currency: "USD",
        price: "100",
        priorPrice: "150",
        costPrice: "50",
        preorderThreshold: 0,
      },
    ];

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

    const input = screen.getByTestId("prior-price-field");

    // Act - Clear the prior price
    fireEvent.change(input, { target: { value: "" } });

    // Assert
    expect(onChange).toHaveBeenCalledWith("1", {
      price: "100",
      priorPrice: null,
      costPrice: "50",
      preorderThreshold: 0,
    });
  });

  it("should display validation error for invalid prior price (field-based error)", () => {
    // Arrange
    const listing: ChannelData[] = [
      {
        id: "channel-123",
        name: "USD Channel",
        currency: "USD",
        price: "100",
        priorPrice: "50",
        costPrice: "30",
        preorderThreshold: 0,
      },
    ];

    const errors = [
      {
        __typename: "ProductError" as const,
        code: ProductErrorCode.INVALID,
        field: "channel-123-channel-priorPrice",
        message: "Prior price must be greater than or equal to selling price",
        attributes: [],
      },
    ];

    render(<ProductVariantPrice errors={errors} productVariantChannelListings={listing} />, {
      wrapper,
    });

    // Assert
    expect(
      screen.getByText("Prior price must be greater than or equal to selling price"),
    ).toBeInTheDocument();
  });
});
