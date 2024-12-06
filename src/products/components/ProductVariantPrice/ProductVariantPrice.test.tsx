import { ChannelData } from "@dashboard/channels/utils";
import { ThemeWrapper } from "@test/themeWrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import { ProductVariantPrice } from "./ProductVariantPrice";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeWrapper>{children}</ThemeWrapper>
);

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));

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
      preorderThreshold: 0,
      costPrice: undefined,
    });
  });
});
