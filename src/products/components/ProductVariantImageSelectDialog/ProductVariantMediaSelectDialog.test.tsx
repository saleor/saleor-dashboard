import { type ProductMediaFragment, ProductMediaType } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductVariantMediaSelectDialog } from "./ProductVariantMediaSelectDialog";

const media: ProductMediaFragment[] = [
  {
    __typename: "ProductMedia",
    id: "media-1",
    url: "https://example.com/1.jpg",
    type: ProductMediaType.IMAGE,
    oembedData: "",
    alt: "Image 1",
    sortOrder: 0,
  },
  {
    __typename: "ProductMedia",
    id: "media-2",
    url: "https://example.com/2.jpg",
    type: ProductMediaType.IMAGE,
    oembedData: "",
    alt: "Image 2",
    sortOrder: 1,
  },
];

const defaultProps = {
  media,
  selectedMedia: ["media-1"],
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

describe("ProductVariantMediaSelectDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables confirm when selection matches committed media", () => {
    // Arrange // Act
    render(
      <Wrapper>
        <ProductVariantMediaSelectDialog {...defaultProps} />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("submit")).toBeDisabled();
  });

  it("enables confirm after changing selection", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <Wrapper>
        <ProductVariantMediaSelectDialog {...defaultProps} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getAllByTestId("variant-media-option")[1]);

    // Assert
    expect(screen.getByTestId("submit")).toBeEnabled();
  });

  it("does not apply unchanged selection on confirm", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <ProductVariantMediaSelectDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("applies changed selection on confirm", async () => {
    // Arrange
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    render(
      <Wrapper>
        <ProductVariantMediaSelectDialog {...defaultProps} onConfirm={onConfirm} />
      </Wrapper>,
    );

    // Act
    await user.click(screen.getAllByTestId("variant-media-option")[1]);
    await user.click(screen.getByTestId("submit"));

    // Assert
    expect(onConfirm).toHaveBeenCalledWith(["media-1", "media-2"]);
  });
});
