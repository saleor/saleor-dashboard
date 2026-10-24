import { type FetchResult } from "@apollo/client";
import {
  ErrorPolicyEnum,
  ProductErrorCode,
  type ProductUpdateMutation,
  type ProductVariantBulkCreateInput,
  type ProductVariantBulkCreateMutation,
  useFileUploadMutation,
  useProductChannelListingUpdateMutation,
  useProductUpdateMutation,
  useProductVariantBulkCreateMutation,
  useProductVariantBulkDeleteMutation,
  useProductVariantBulkUpdateMutation,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { type ProductUpdateSubmitData } from "@dashboard/products/components/ProductUpdatePage/types";
import { act, renderHook } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { product as productFixture } from "../../../fixtures";
import { useProductUpdateHandler } from "./useProductUpdateHandler";

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<Record<string, unknown>>("@dashboard/graphql"),
  useFileUploadMutation: jest.fn(),
  useProductChannelListingUpdateMutation: jest.fn(),
  useProductUpdateMutation: jest.fn(),
  useProductVariantBulkCreateMutation: jest.fn(),
  useProductVariantBulkDeleteMutation: jest.fn(),
  useProductVariantBulkUpdateMutation: jest.fn(),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: jest.fn(),
}));

const mockTrackEvent = jest.fn();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));

const wrapper = ({ children }: { children: ReactNode }): ReactElement => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

const product = productFixture("");

const productUpdateResult: FetchResult<ProductUpdateMutation> = {
  data: {
    __typename: "Mutation",
    productUpdate: {
      __typename: "ProductUpdate",
      errors: [],
    },
  },
};

const createBulkCreateResult = (
  errorIndexes: number[],
): FetchResult<ProductVariantBulkCreateMutation> => ({
  data: {
    __typename: "Mutation",
    productVariantBulkCreate: {
      __typename: "ProductVariantBulkCreate",
      errors: errorIndexes.map(index => ({
        __typename: "BulkProductError",
        field: "sku",
        code: ProductErrorCode.UNIQUE,
        index,
        channels: null,
        message: "Duplicated SKU.",
      })),
      results: [],
      productVariants: [],
    },
  },
});

// Manually added rows with only name and SKU filled — no attribute values.
const stagedCreates: ProductVariantBulkCreateInput[] = [
  { name: "A", sku: "SKU-A", attributes: [] },
  { name: "B", sku: "SKU-B", attributes: [] },
  { name: "C", sku: "SKU-C", attributes: [] },
];

const submitData: ProductUpdateSubmitData = {
  attributes: [],
  attributesWithNewFileValue: [],
  category: null,
  channels: { removeChannels: [], updateChannels: [] },
  collections: [],
  description: { blocks: [] },
  isAvailable: true,
  name: product.name,
  rating: 0,
  seoDescription: "",
  seoTitle: "",
  sku: "",
  slug: product.slug,
  taxClassId: "",
  trackInventory: true,
  weight: "",
  variants: {
    added: [],
    removed: [],
    updates: [],
    removedVariantIds: [],
    stagedUpdateVariants: [],
    stagedUpdateChanges: { added: [], removed: [], updates: [] },
    stagedCreates,
  },
};

describe("useProductUpdateHandler", () => {
  const createVariants = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNotifier as jest.Mock).mockReturnValue(jest.fn());
    (useFileUploadMutation as jest.Mock).mockReturnValue([jest.fn()]);
    (useProductChannelListingUpdateMutation as jest.Mock).mockReturnValue([jest.fn()]);
    (useProductUpdateMutation as jest.Mock).mockReturnValue([
      jest.fn().mockResolvedValue(productUpdateResult),
    ]);
    (useProductVariantBulkCreateMutation as jest.Mock).mockReturnValue([createVariants]);
    (useProductVariantBulkDeleteMutation as jest.Mock).mockReturnValue([jest.fn()]);
    (useProductVariantBulkUpdateMutation as jest.Mock).mockReturnValue([jest.fn()]);
  });

  it("submits every staged create, even when none has attribute values", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([]));

    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    await act(async () => {
      await result.current[0](submitData);
    });

    // Assert
    expect(createVariants).toHaveBeenCalledTimes(1);
    expect(createVariants).toHaveBeenCalledWith({
      variables: {
        id: product.id,
        inputs: stagedCreates,
        errorPolicy: ErrorPolicyEnum.REJECT_EVERYTHING,
      },
    });
  });

  it("reports create errors at their staged create positions", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([1, 2]));

    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    let errors: Awaited<ReturnType<(typeof result.current)[0]>> = [];

    await act(async () => {
      errors = await result.current[0](submitData);
    });

    // Assert
    expect(errors).toEqual([
      expect.objectContaining({ type: "create", index: 1 }),
      expect.objectContaining({ type: "create", index: 2 }),
    ]);
  });
  it("tracks a changed rating as an explicit write of the deprecated field", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([]));

    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    await act(async () => {
      await result.current[0]({ ...submitData, rating: 4 });
    });

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledWith("product_rating_submitted");
  });

  it("tracks a cleared rating as an explicit write", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([]));

    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    await act(async () => {
      await result.current[0]({ ...submitData, rating: "" as unknown as number });
    });

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledWith("product_rating_submitted");
  });

  it("does not track the rating when the submitted value matches the saved one", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([]));

    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    await act(async () => {
      await result.current[0]({ ...submitData, rating: product.rating as number });
    });

    // Assert
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it("does not track the rating when the field was not changed", async () => {
    // Arrange
    createVariants.mockResolvedValue(createBulkCreateResult([]));

    const { rating: _rating, ...dataWithoutRating } = submitData;
    const { result } = renderHook(() => useProductUpdateHandler(product), { wrapper });

    // Act
    await act(async () => {
      await result.current[0](dataWithoutRating as ProductUpdateSubmitData);
    });

    // Assert
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});
