import { type ProductFragment, ProductMediaType } from "@dashboard/graphql";

import {
  createImageReorderHandler,
  createImagesUploadCompleteHandler,
  createImageUploadHandler,
} from "./index";

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

describe("createImageUploadHandler", () => {
  const file = new File(["image-bytes"], "shoe.png", { type: "image/png" });

  it("uploads the file and resolves when the mutation succeeds", async () => {
    // Arrange
    const createProductImage = jest.fn().mockResolvedValue({
      data: {
        productMediaCreate: {
          errors: [],
          product: { id: "product-1", media: [] },
        },
      },
    });
    const handler = createImageUploadHandler("product-1", createProductImage);

    // Act
    await handler(file);

    // Assert
    expect(createProductImage).toHaveBeenCalledWith({
      alt: "",
      image: file,
      product: "product-1",
    });
  });

  it("rejects when the mutation returns errors", async () => {
    // Arrange
    const createProductImage = jest.fn().mockResolvedValue({
      data: {
        productMediaCreate: {
          errors: [{ field: "image", code: "INVALID", message: "Invalid image" }],
          product: null,
        },
      },
    });
    const handler = createImageUploadHandler("product-1", createProductImage);

    // Act & Assert
    await expect(handler(file)).rejects.toThrow("Failed to upload product media");
  });
});

describe("createImagesUploadCompleteHandler", () => {
  const intl = {
    formatMessage: jest.fn((_message, values) => JSON.stringify(values)),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("notifies success for a fully successful batch", () => {
    // Arrange
    const notify = jest.fn();
    const handler = createImagesUploadCompleteHandler(notify, intl);

    // Act
    handler({ successCount: 3, failureCount: 0 });

    // Assert
    expect(notify).toHaveBeenCalledWith({
      status: "success",
      text: JSON.stringify({ count: 3 }),
    });
  });

  it("notifies error when every upload failed", () => {
    // Arrange
    const notify = jest.fn();
    const handler = createImagesUploadCompleteHandler(notify, intl);

    // Act
    handler({ successCount: 0, failureCount: 2 });

    // Assert
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        text: JSON.stringify({ count: 2 }),
      }),
    );
  });

  it("notifies warning for a partial batch", () => {
    // Arrange
    const notify = jest.fn();
    const handler = createImagesUploadCompleteHandler(notify, intl);

    // Act
    handler({ successCount: 2, failureCount: 1 });

    // Assert
    expect(notify).toHaveBeenCalledWith({
      status: "warning",
      text: JSON.stringify({ success: 2, failed: 1 }),
    });
  });
});

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
