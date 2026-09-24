import {
  type BulkPublishDefaults,
  type ProductPublishDraft,
} from "@dashboard/channels/components/BulkPublishToChannelDialog/types";
import { act, renderHook } from "@testing-library/react";

import { useBulkPublishToChannelSubmit } from "./useBulkPublishToChannelSubmit";

const mockNotify = jest.fn();
const mockTrackEvent = jest.fn();
const mockFetchProductsData = jest.fn();
const mockUpdateChannelListing = jest.fn();
const mockBulkUpdateVariants = jest.fn();

jest.mock("@apollo/client", () => ({
  useApolloClient: () => ({}),
}));
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: () => mockNotify,
}));
jest.mock("react-intl", () => ({
  defineMessages: <TMessages>(messages: TMessages): TMessages => messages,
  useIntl: () => ({ formatMessage: jest.fn(() => "Price is required") }),
}));
jest.mock("@dashboard/graphql", () => ({
  ErrorPolicyEnum: { REJECT_FAILED_ROWS: "REJECT_FAILED_ROWS" },
  useBulkPublishProductsDataQuery: () => ({ refetch: mockFetchProductsData }),
  useProductChannelListingUpdateMutation: () => [mockUpdateChannelListing],
  useProductVariantBulkUpdateMutation: () => [mockBulkUpdateVariants],
}));

const defaults: BulkPublishDefaults = {
  stock: {
    enabled: true,
    defaultQuantity: "10",
    warehouseScope: "all_channel",
    warehouseId: "",
  },
  isPublished: true,
  visibleInListings: true,
  isAvailableForPurchase: true,
};

const draftWithInvalidPrice: ProductPublishDraft = {
  productId: "product-1",
  name: "Product",
  variantCount: 1,
  exceedsVariantLimit: false,
  hasManyVariants: false,
  hasCategory: true,
  alreadyInChannel: false,
  price: "-1",
  costPrice: "",
  stock: "10",
};

describe("useBulkPublishToChannelSubmit analytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("tracks a failed run when validation rejects the selected products", async () => {
    // Arrange
    const { result } = renderHook(() =>
      useBulkPublishToChannelSubmit({
        channel: {
          id: "channel-1",
          name: "Default Channel",
          slug: "default-channel",
          currencyCode: "USD",
        },
        channelWarehouses: [],
      }),
    );

    // Act
    let publishResult: { failedProductIds: string[] } | undefined;

    await act(async () => {
      publishResult = await result.current.publishProducts({
        productDrafts: [draftWithInvalidPrice],
        defaults,
        productIds: [draftWithInvalidPrice.productId],
        onProgressChange: jest.fn(),
      });
    });

    // Assert
    expect(mockTrackEvent).toHaveBeenNthCalledWith(1, "channel_bulk_publish_started", {
      price_mode: "set_price",
      product_count: 1,
      publish_enabled: true,
      stock_enabled: true,
    });
    expect(mockTrackEvent).toHaveBeenNthCalledWith(2, "channel_bulk_publish_completed", {
      price_mode: "set_price",
      product_count: 1,
      publish_enabled: true,
      stock_enabled: true,
      failed_product_count: 1,
      result: "failure",
    });
    expect(mockNotify).toHaveBeenCalledWith({
      status: "error",
      text: "Price is required",
    });
    expect(mockFetchProductsData).not.toHaveBeenCalled();
    expect(publishResult).toEqual({ failedProductIds: [draftWithInvalidPrice.productId] });
  });
});
