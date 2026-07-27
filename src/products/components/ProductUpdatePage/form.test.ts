import {
  ProductErrorCode,
  type ProductFragment,
  type ProductVariantBulkCreateInput,
} from "@dashboard/graphql";
import { type ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { act, renderHook } from "@testing-library/react";

import { useProductUpdateForm } from "./form";
import { hasProductSaveComposition } from "./saveComposition";
import { type UseProductUpdateFormOpts } from "./types";

jest.mock("@dashboard/utils/richText/useRichText", () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      getValue: jest.fn(),
      isDirty: false,
    })),
    useRichText: jest.fn(() => ({
      getValue: jest.fn(),
      isDirty: false,
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
};

const formOpts = { variants: [] } as unknown as UseProductUpdateFormOpts;

const productWithName = {
  name: "Original product",
  slug: "original-product",
  channelListings: [],
  attributes: [],
} as unknown as ProductFragment;

describe("useProductUpdateForm", () => {
  it("should clear datagrid change set after submitting the form", async () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useProductUpdateForm(
        { channelListings: [] } as unknown as ProductFragment,
        mockOnSubmit,
        false,
        jest.fn(),
        formOpts,
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
        removedVariantIds: [],
        stagedUpdateVariants: [],
        stagedUpdateChanges: {
          added: [],
          removed: [],
          updates: [],
        },
        stagedCreates: [],
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
        removedVariantIds: [],
        stagedUpdateVariants: [],
        stagedUpdateChanges: {
          added: [],
          removed: [],
          updates: [],
        },
        stagedCreates: [],
      },
    });
  });

  it("submits form with the only data that was modified", async () => {
    // Arrange
    const mockOnSubmit = jest.fn();
    const { result } = renderHook(() =>
      useProductUpdateForm(
        { channelListings: [] } as unknown as ProductFragment,
        mockOnSubmit,
        false,
        jest.fn(),
        formOpts,
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
      slug: "test-slug-1",
      category: "test-category",
      collections: ["collection-1"],
      variants: {
        added: [],
        removed: [],
        updates: [],
        removedVariantIds: [],
        stagedUpdateVariants: [],
        stagedUpdateChanges: {
          added: [],
          removed: [],
          updates: [],
        },
        stagedCreates: [],
      },
      rating: 4,
      seoTitle: "seo-title-1",
      seoDescription: "seo-desc-1",
    });
  });

  describe("dirty state and Save enablement", () => {
    it("disables Save when the form matches the saved product", () => {
      // Arrange / Act
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), false, jest.fn(), formOpts),
      );

      // Assert
      expect(hasProductSaveComposition(result.current.saveComposition)).toBe(false);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it("enables Save and marks details when the name changes", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), false, jest.fn(), formOpts),
      );

      // Act
      act(() => {
        result.current.change({ target: { name: "name", value: "Renamed product" } });
      });

      // Assert
      expect(result.current.saveComposition.hasDetails).toBe(true);
      expect(result.current.isSaveDisabled).toBe(false);
    });

    it("clears Save composition and disables Save after name is reverted", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), false, jest.fn(), formOpts),
      );

      // Act — edit then revert to the original saved value
      act(() => {
        result.current.change({ target: { name: "name", value: "Renamed product" } });
      });
      act(() => {
        result.current.change({
          target: { name: "name", value: "Original product" },
        });
      });

      // Assert
      expect(result.current.saveComposition.hasDetails).toBe(false);
      expect(hasProductSaveComposition(result.current.saveComposition)).toBe(false);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it("does not include reverted fields in the submit payload", async () => {
      // Arrange
      const mockOnSubmit = jest.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      // Act
      act(() => {
        result.current.change({ target: { name: "name", value: "Temporary" } });
        result.current.change({ target: { name: "slug", value: "new-slug" } });
        result.current.change({
          target: { name: "name", value: "Original product" },
        });
      });
      await act(async () => {
        await result.current.submit();
      });

      // Assert — name reverted; only slug should be in changed payload fields
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: "new-slug",
        }),
      );
      expect(mockOnSubmit.mock.calls[0][0]).not.toHaveProperty("name");
    });

    it("keeps Save enabled when variants are staged even if details are clean", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), false, jest.fn(), formOpts),
      );

      // Act
      act(() => {
        result.current.handlers.changeVariants({
          added: [0],
          removed: [],
          updates: [],
        });
      });

      // Assert
      expect(result.current.saveComposition.variantCreateCount).toBe(1);
      expect(result.current.saveComposition.hasDetails).toBe(false);
      expect(result.current.isSaveDisabled).toBe(false);
    });

    it("disables Save while the page is disabled even if dirty", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), true, jest.fn(), formOpts),
      );

      // Act
      act(() => {
        result.current.change({ target: { name: "name", value: "Renamed" } });
      });

      // Assert
      expect(result.current.saveComposition.hasDetails).toBe(true);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it("disables Save when the name is cleared (invalid) even if dirty", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, jest.fn(), false, jest.fn(), formOpts),
      );

      // Act
      act(() => {
        result.current.change({ target: { name: "name", value: "" } });
      });

      // Assert
      expect(result.current.saveComposition.hasDetails).toBe(true);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it("keeps detail edits after a failed submit so the merchant can retry", async () => {
      // Arrange
      const mockOnSubmit = jest.fn().mockResolvedValue([{ message: "boom" }]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      act(() => {
        result.current.change({ target: { name: "name", value: "Renamed product" } });
      });

      // Act
      await act(async () => {
        await result.current.submit();
      });

      // Assert
      expect(result.current.saveComposition.hasDetails).toBe(true);
      expect(result.current.isSaveDisabled).toBe(false);
    });
  });

  describe("retry safety after a failed submit", () => {
    it("drops grid-added rows when BulkCreate accepted them but another step failed", async () => {
      // Arrange - a non-create error means BulkCreate ran and accepted every row
      const mockOnSubmit = jest.fn().mockResolvedValue([{ message: "product update failed" }]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      act(() => {
        result.current.change({ target: { name: "name", value: "Renamed product" } });
        result.current.handlers.changeVariants({
          added: [0],
          removed: [],
          updates: [],
        });
      });

      // Act
      await act(async () => {
        await result.current.submit();
      });

      // Assert - created rows are gone; detail edits stay for the retry
      expect(result.current.saveComposition.variantCreateCount).toBe(0);
      expect(result.current.saveComposition.hasDetails).toBe(true);
      expect(result.current.isSaveDisabled).toBe(false);

      // Act - retry must not resubmit the already-created rows
      await act(async () => {
        await result.current.submit();
      });

      // Assert
      expect(mockOnSubmit).toHaveBeenLastCalledWith(
        expect.objectContaining({
          variants: expect.objectContaining({ added: [] }),
        }),
      );
    });

    it("keeps only the grid-added rows that BulkCreate rejected", async () => {
      // Arrange - row 1 failed, row 0 was created
      const createError: ProductVariantListError = {
        __typename: "DatagridError",
        type: "create",
        index: 1,
        error: ProductErrorCode.INVALID,
      };
      const mockOnSubmit = jest.fn().mockResolvedValue([createError]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      act(() => {
        // The Datagrid keeps its own added-rows state in sync with the change handler
        result.current.datagrid.setAdded([0, 1]);
        result.current.handlers.changeVariants({
          added: [0, 1],
          removed: [],
          updates: [],
        });
      });

      // Act
      await act(async () => {
        await result.current.submit();
      });

      // Assert
      expect(result.current.saveComposition.variantCreateCount).toBe(1);
      expect(result.current.isSaveDisabled).toBe(false);
    });

    it("keeps only the staged creates that BulkCreate rejected", async () => {
      // Arrange - staged row 1 failed, staged row 0 was created
      const stagedCreates: ProductVariantBulkCreateInput[] = [
        { name: "Red / S", sku: "R-S", attributes: [] },
        { name: "Red / M", sku: "R-M", attributes: [] },
      ];
      const createError: ProductVariantListError = {
        __typename: "DatagridError",
        type: "create",
        index: -1,
        stagedIndex: 1,
        error: ProductErrorCode.INVALID,
      };
      const mockOnSubmit = jest.fn().mockResolvedValue([createError]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      act(() => {
        result.current.handlers.replaceStagedVariantCreates(stagedCreates);
      });

      // Act
      await act(async () => {
        await result.current.submit();
      });

      // Assert - only the rejected staged row remains for the retry
      expect(result.current.stagedVariantCreates).toEqual([stagedCreates[1]]);
      expect(result.current.saveComposition.variantCreateCount).toBe(1);
    });

    it("clears staged creates when BulkCreate accepted them but another step failed", async () => {
      // Arrange
      const stagedCreates: ProductVariantBulkCreateInput[] = [
        { name: "Red / S", sku: "R-S", attributes: [] },
      ];
      const mockOnSubmit = jest.fn().mockResolvedValue([{ message: "product update failed" }]);
      const { result } = renderHook(() =>
        useProductUpdateForm(productWithName, mockOnSubmit, false, jest.fn(), formOpts),
      );

      act(() => {
        result.current.handlers.replaceStagedVariantCreates(stagedCreates);
      });

      // Act
      await act(async () => {
        await result.current.submit();
      });

      // Assert
      expect(result.current.stagedVariantCreates).toEqual([]);
      expect(result.current.saveComposition.variantCreateCount).toBe(0);
    });
  });
});
