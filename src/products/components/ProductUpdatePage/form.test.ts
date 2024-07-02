import { ProductFragment } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react-hooks";

import { useProductUpdateForm } from "./form";
import { UseProductUpdateFormOpts } from "./types";

jest.mock("@dashboard/utils/richText/useRichText", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      getValue: jest.fn(),
    })),
    useRichText: jest.fn(() => ({
      getValue: jest.fn(),
    })),
  };
});

const baseData = {
  attributes: [],
  attributesWithNewFileValue: [],
  channels: {
    removeChannels: [],
    updateChannels: [],
  },
  description: undefined,
  metadata: undefined,
  privateMetadata: undefined,
};

describe("useProductUpdateForm", () => {
  it("should clear datagrid change set after submitting the form", async () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useProductUpdateForm(
        { variants: [], channelListings: [] } as unknown as ProductFragment,
        mockOnSubmit,
        false,
        jest.fn(),
        {} as UseProductUpdateFormOpts,
      ),
    );

    // Act
    await act(() => {
      result.current.handlers.changeVariants({
        added: [0, 1],
        removed: [],
        updates: [],
      });
    });
    await act(async () => {
      await result.current.submit();
    });
    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...baseData,
      variants: {
        added: [0, 1],
        removed: [],
        updates: [],
      },
    });
    // Act
    await act(async () => {
      await result.current.submit();
    });
    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...baseData,
      variants: {
        added: [],
        removed: [],
        updates: [],
      },
    });
  });

  it("submits form with the only data that was modified", async () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useProductUpdateForm(
        { variants: [], channelListings: [] } as unknown as ProductFragment,
        mockOnSubmit,
        false,
        jest.fn(),
        {} as UseProductUpdateFormOpts,
      ),
    );

    // Act
    await act(() => {
      result.current.change({ target: { name: "slug", value: "test-slug-1" } });
      result.current.change({ target: { name: "category", value: "test-category" } });
      result.current.change({ target: { name: "collections", value: ["collection-1"] } });
      result.current.change({ target: { name: "rating", value: 4 } });
      result.current.change({ target: { name: "seoTitle", value: "seo-title-1" } });
      result.current.change({ target: { name: "seoDescription", value: "seo-desc-1" } });
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      attributes: [],
      attributesWithNewFileValue: [],
      channels: {
        removeChannels: [],
        updateChannels: [],
      },
      description: undefined,
      metadata: undefined,
      privateMetadata: undefined,
      slug: "test-slug-1",
      category: "test-category",
      collections: ["collection-1"],
      variants: {
        added: [],
        removed: [],
        updates: [],
      },
      rating: 4,
      seoTitle: "seo-title-1",
      seoDescription: "seo-desc-1",
    });
  });
});
