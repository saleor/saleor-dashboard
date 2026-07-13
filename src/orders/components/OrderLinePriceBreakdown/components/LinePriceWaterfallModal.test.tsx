import { OrderDiscountType } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { type LinePriceWaterfall } from "../utils/types";
import { LinePriceWaterfallModal } from "./LinePriceWaterfallModal";

const waterfall: LinePriceWaterfall = {
  lineId: "line-1",
  productName: "White Plimsolls",
  variantName: "41",
  productSku: "white-plimsolls-41",
  thumbnailUrl: "https://example.com/thumb.png",
  quantity: 1,
  fractionDigits: 2,
  start: { __typename: "Money", amount: 100, currency: "USD" },
  end: { __typename: "Money", amount: 60, currency: "USD" },
  factors: [
    {
      kind: "catalogue_promotion",
      name: "Summer sale",
      signedDelta: { __typename: "Money", amount: 40, currency: "USD" },
      sourceType: OrderDiscountType.SALE,
    },
  ],
  warnings: [],
};

const renderModal = (onClose = jest.fn()) =>
  render(
    <Wrapper>
      <LinePriceWaterfallModal waterfall={waterfall} onClose={onClose} />
    </Wrapper>,
  );

describe("LinePriceWaterfallModal", () => {
  it("closes from the header icon and footer button", () => {
    // Arrange
    const onClose = jest.fn();

    renderModal(onClose);

    // Act
    fireEvent.click(screen.getByTestId("close-button"));
    fireEvent.click(screen.getByTestId("back"));

    // Assert
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("renders the price waterfall steps", () => {
    // Arrange // Act
    renderModal();

    // Assert
    expect(screen.getByTestId("price-waterfall-step-start")).toBeInTheDocument();
    expect(screen.getByTestId("price-waterfall-step-end")).toBeInTheDocument();
  });
});
