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
  category: "",
  channels: {
    removeChannels: [],
    updateChannels: [],
  },
  collections: [],
  description: undefined,
  globalSoldUnits: 0,
  globalThreshold: "",
  hasPreorderEndDate: false,
  isAvailable: false,
  isPreorder: false,
  metadata: undefined,
  name: "",
  preorderEndDateTime: undefined,
  privateMetadata: undefined,
  rating: null,
  seoDescription: "",
  seoTitle: "",
  sku: "",
  slug: "",
  taxClassId: undefined,
  trackInventory: false,
  weight: "",
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
});
