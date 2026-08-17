import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { type ProductSetupReadiness } from "./getProductSetupReadiness";
import { ProductSetupCard } from "./ProductSetupCard";

const incompleteReadiness: ProductSetupReadiness = {
  hasChannels: false,
  hasShopReadyChannel: false,
  hasCategory: false,
  hasVariants: false,
  hasOffer: false,
  hasStock: false,
  needsStock: true,
  isLive: false,
  channelCount: 0,
  mediaCount: 0,
  seoStatus: "empty",
  setupChannelId: null,
  coreReady: false,
};

describe("ProductSetupCard", () => {
  it("shows the channel step as the primary CTA when no channels are assigned", () => {
    // Arrange & Act
    render(
      <ProductSetupCard
        readiness={incompleteReadiness}
        onManageChannels={jest.fn()}
        onFinishChannelSetup={jest.fn()}
        onMakeAvailable={jest.fn()}
        onDismiss={jest.fn()}
        isShippingRequired
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("product-setup-card")).toBeInTheDocument();
    expect(screen.getByTestId("setup-product-channels")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("0 of 5");
  });

  it("shows make-available when earlier sell steps are complete", () => {
    // Arrange & Act
    render(
      <ProductSetupCard
        readiness={{
          ...incompleteReadiness,
          hasChannels: true,
          hasShopReadyChannel: true,
          hasCategory: true,
          hasVariants: true,
          hasOffer: true,
          hasStock: true,
          needsStock: true,
          isLive: false,
          channelCount: 1,
          coreReady: false,
          setupChannelId: "ch1",
        }}
        onManageChannels={jest.fn()}
        onFinishChannelSetup={jest.fn()}
        onMakeAvailable={jest.fn()}
        isShippingRequired
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-product-make-available")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-progress")).toHaveTextContent("4 of 5");
  });

  it("hides make-available until inventory is ready when stock is required", () => {
    // Arrange & Act
    render(
      <ProductSetupCard
        readiness={{
          ...incompleteReadiness,
          hasChannels: true,
          hasShopReadyChannel: true,
          hasCategory: true,
          hasVariants: true,
          hasOffer: true,
          hasStock: false,
          needsStock: true,
          isLive: false,
          channelCount: 1,
          coreReady: false,
          setupChannelId: "ch1",
        }}
        onManageChannels={jest.fn()}
        onFinishChannelSetup={jest.fn()}
        onMakeAvailable={jest.fn()}
        isShippingRequired
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.queryByTestId("setup-product-make-available")).not.toBeInTheDocument();
    expect(screen.getByTestId("setup-product-stock")).toBeInTheDocument();
  });

  it("shows attributes as a review row with none when the product type has no attributes", () => {
    // Arrange & Act
    render(
      <ProductSetupCard
        readiness={incompleteReadiness}
        onManageChannels={jest.fn()}
        onFinishChannelSetup={jest.fn()}
        onMakeAvailable={jest.fn()}
        isShippingRequired
        productAttributeCount={0}
        variantAttributeCount={0}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("setup-checklist-review-attributes")).toBeInTheDocument();
    expect(screen.getByTestId("setup-checklist-review-attributes")).toHaveTextContent("None");
  });

  it("opens product type settings from the attributes review row when the type has none", () => {
    // Arrange
    const onOpenProductType = jest.fn();

    render(
      <ProductSetupCard
        readiness={incompleteReadiness}
        onManageChannels={jest.fn()}
        onFinishChannelSetup={jest.fn()}
        onMakeAvailable={jest.fn()}
        isShippingRequired
        productAttributeCount={0}
        variantAttributeCount={0}
        onOpenProductType={onOpenProductType}
      />,
      { wrapper: Wrapper },
    );

    // Act
    screen.getByTestId("setup-checklist-review-attributes").click();

    // Assert
    expect(onOpenProductType).toHaveBeenCalled();
  });
});
