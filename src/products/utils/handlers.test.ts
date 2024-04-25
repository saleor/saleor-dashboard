import { ProductMediaType } from "@dashboard/graphql";

import { handleAssignMedia } from "./handlers";

type HandleAssignMediaParams = Parameters<typeof handleAssignMedia>;

describe("Product handlers", () => {
  it("should not alter product variant media when the same selected media ids as previously passed", async () => {
    // Arrange
    const media: HandleAssignMediaParams[0] = ["1", "2"];
    const variant: HandleAssignMediaParams[1] = {
      id: "1",
      media: [
        {
          id: "1",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
        {
          id: "2",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
      ],
    };
    const assignMedia = jest.fn(() => Promise.resolve({}));
    const unassignMedia = jest.fn(() => Promise.resolve({}));

    // Act
    await handleAssignMedia(media, variant, assignMedia, unassignMedia);
    // Assert
    expect(assignMedia).not.toHaveBeenCalled();
    expect(unassignMedia).not.toHaveBeenCalled();
  });
  it("should assign media to product variant when more then all previous selected media ids passed", async () => {
    // Arrange
    const media: HandleAssignMediaParams[0] = ["1", "2", "3"];
    const variant: HandleAssignMediaParams[1] = {
      id: "1",
      media: [
        {
          id: "3",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
      ],
    };
    const assignMedia = jest.fn(() => Promise.resolve({}));
    const unassignMedia = jest.fn(() => Promise.resolve({}));

    // Act
    await handleAssignMedia(media, variant, assignMedia, unassignMedia);
    // Assert
    expect(assignMedia).toHaveBeenCalledTimes(2);
    expect(assignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "1",
    });
    expect(assignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "2",
    });
    expect(unassignMedia).not.toHaveBeenCalled();
  });
  it("should unassign media from product variant when not all previous selected media ids passed", async () => {
    // Arrange
    const media: HandleAssignMediaParams[0] = ["3"];
    const variant: HandleAssignMediaParams[1] = {
      id: "1",
      media: [
        {
          id: "1",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
        {
          id: "2",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
        {
          id: "3",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
      ],
    };
    const assignMedia = jest.fn(() => Promise.resolve({}));
    const unassignMedia = jest.fn(() => Promise.resolve({}));

    // Act
    await handleAssignMedia(media, variant, assignMedia, unassignMedia);
    // Assert
    expect(assignMedia).not.toHaveBeenCalled();
    expect(unassignMedia).toHaveBeenCalledTimes(2);
    expect(unassignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "1",
    });
    expect(unassignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "2",
    });
  });
  it("should assign and unassign media from product variant when not all but more selected media ids from previously selected passed", async () => {
    // Arrange
    const media: HandleAssignMediaParams[0] = ["1", "3"];
    const variant: HandleAssignMediaParams[1] = {
      id: "1",
      media: [
        {
          id: "1",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
        {
          id: "2",
          url: "",
          type: ProductMediaType.IMAGE,
          oembedData: null,
          __typename: "ProductMedia",
        },
      ],
    };
    const assignMedia = jest.fn(() => Promise.resolve({}));
    const unassignMedia = jest.fn(() => Promise.resolve({}));

    // Act
    await handleAssignMedia(media, variant, assignMedia, unassignMedia);
    // Assert
    expect(assignMedia).toHaveBeenCalledTimes(1);
    expect(assignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "3",
    });
    expect(unassignMedia).toHaveBeenCalledTimes(1);
    expect(unassignMedia).toHaveBeenCalledWith({
      variantId: "1",
      mediaId: "2",
    });
  });
});
