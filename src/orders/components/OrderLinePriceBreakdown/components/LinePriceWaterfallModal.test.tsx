import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import {
  discountedWaterfall,
  overriddenNoDiscountWaterfall,
  overriddenNoReasonWaterfall,
} from "../fixtures";
import { type LinePriceWaterfall } from "../utils/types";
import { LinePriceWaterfallModal } from "./LinePriceWaterfallModal";

const renderModal = (waterfall: LinePriceWaterfall = discountedWaterfall, onClose = jest.fn()) =>
  render(
    <Wrapper>
      <LinePriceWaterfallModal waterfall={waterfall} onClose={onClose} />
    </Wrapper>,
  );

describe("LinePriceWaterfallModal", () => {
  it("closes from the header icon and footer button", () => {
    // Arrange
    const onClose = jest.fn();

    renderModal(discountedWaterfall, onClose);

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

  it("shows the overridden badge and reason on the base row when the price was overridden", () => {
    // Arrange // Act
    renderModal(overriddenNoDiscountWaterfall);

    // Assert
    expect(screen.getByTestId("price-waterfall-overridden-badge")).toBeInTheDocument();
    expect(
      screen.getByText(overriddenNoDiscountWaterfall.priceOverrideReason!),
    ).toBeInTheDocument();
  });

  it("shows a fallback explainer when overridden without a recorded reason", () => {
    // Arrange // Act
    renderModal(overriddenNoReasonWaterfall);

    // Assert
    expect(screen.getByTestId("price-waterfall-overridden-badge")).toBeInTheDocument();
    expect(screen.getByText("Custom price set for this line")).toBeInTheDocument();
  });

  it("does not show the overridden badge for a non-overridden line", () => {
    // Arrange // Act
    renderModal(discountedWaterfall);

    // Assert
    expect(screen.queryByTestId("price-waterfall-overridden-badge")).not.toBeInTheDocument();
  });
});
