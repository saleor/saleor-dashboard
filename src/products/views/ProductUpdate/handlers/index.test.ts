import { type ProductFragment, ProductMediaType } from "@dashboard/graphql";

import { createImageReorderHandler } from "./index";

function createProductWithMedia(mediaIds: string[]): ProductFragment {
  return {
    id: "product-1",
    media: mediaIds.map((id, sortOrder) => ({
      __typename: "ProductMedia",
      alt: "",
      id,
      oembedData: "{}",
      sortOrder,
      type: ProductMediaType.IMAGE,
      url: `https://example.com/${id}.jpg`,
    })),
  } as ProductFragment;
}

describe("createImageReorderHandler", () => {
  it("does not call reorder when product is undefined", () => {
    // Arrange
    const reorderProductImages = jest.fn();
    const handler = createImageReorderHandler(undefined, reorderProductImages);

    // Act
    handler({ oldIndex: 0, newIndex: 1 });

    // Assert
    expect(reorderProductImages).not.toHaveBeenCalled();
  });

  it("does not call reorder when product has no media", () => {
    // Arrange
    const reorderProductImages = jest.fn();
    const product = createProductWithMedia([]);
    const handler = createImageReorderHandler(product, reorderProductImages);

    // Act
    handler({ oldIndex: 0, newIndex: 1 });

    // Assert
    expect(reorderProductImages).not.toHaveBeenCalled();
  });

  it("reorders media with variables and optimistic response", () => {
    // Arrange
    const reorderProductImages = jest.fn();
    const product = createProductWithMedia(["media-a", "media-b", "media-c"]);
    const handler = createImageReorderHandler(product, reorderProductImages);

    if (!product.media) {
      throw new Error("Expected test product to have media");
    }

    const [mediaA, mediaB, mediaC] = product.media;

    // Act
    handler({ oldIndex: 0, newIndex: 2 });

    // Assert
    expect(reorderProductImages).toHaveBeenCalledTimes(1);
    expect(reorderProductImages).toHaveBeenCalledWith({
      variables: {
        mediaIds: ["media-b", "media-c", "media-a"],
        productId: "product-1",
      },
      optimisticResponse: {
        __typename: "Mutation",
        productMediaReorder: {
          __typename: "ProductMediaReorder",
          errors: [],
          product: {
            __typename: "Product",
            id: "product-1",
            media: [mediaB, mediaC, mediaA],
          },
        },
      },
    });
  });
});
