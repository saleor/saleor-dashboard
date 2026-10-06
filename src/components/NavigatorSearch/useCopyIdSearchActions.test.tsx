import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { type ContextualSearchAction } from "@dashboard/extensions/search-actions/types";
import {
  type OrderNumberFragment,
  OrderNumberFragmentDoc,
  type ProductVariantProductIdFragment,
  ProductVariantProductIdFragmentDoc,
} from "@dashboard/graphql";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { MemoryRouter } from "react-router";

import { useCopyIdSearchActions } from "./useCopyIdSearchActions";

const mockTrackEvent = jest.fn();
const mockNotify = jest.fn();

jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));

const ORDER_ID = "T3JkZXI6MQ==";
const VARIANT_ID = "UHJvZHVjdFZhcmlhbnQ6MQ==";
const PRODUCT_ID = "UHJvZHVjdDox";

const order: OrderNumberFragment = { __typename: "Order", id: ORDER_ID, number: "1234" };
const variant: ProductVariantProductIdFragment = {
  __typename: "ProductVariant",
  id: VARIANT_ID,
  product: { __typename: "Product", id: PRODUCT_ID },
};

const renderActions = (
  path: string,
  fillCache?: (cache: InMemoryCache) => void,
): ContextualSearchAction[] => {
  const cache = new InMemoryCache();

  fillCache?.(cache);

  const Wrapper = ({ children }: { children: ReactNode }): ReactElement => (
    <MockedProvider cache={cache}>
      <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
    </MockedProvider>
  );

  return renderHook(() => useCopyIdSearchActions(), { wrapper: Wrapper }).result.current;
};

const labels = (actions: ContextualSearchAction[]): string[] => actions.map(action => action.label);

describe("useCopyIdSearchActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, { clipboard: { writeText: jest.fn().mockResolvedValue(undefined) } });
  });

  it("offers the order ID and, once cached, the order number", () => {
    // Arrange
    const path = `/orders/${encodeURIComponent(ORDER_ID)}`;

    // Act
    const withoutCache = renderActions(path);
    const withCache = renderActions(path, cache =>
      cache.writeFragment({ fragment: OrderNumberFragmentDoc, data: order }),
    );

    // Assert
    expect(labels(withoutCache)).toEqual(["Copy order ID"]);
    expect(labels(withCache)).toEqual(["Copy order ID", "Copy order number"]);
  });

  it("offers the variant ID first and, once cached, the product ID on variant pages", () => {
    // Arrange
    const path = `/products/variant/${encodeURIComponent(VARIANT_ID)}`;

    // Act
    const withoutCache = renderActions(path);
    const withCache = renderActions(path, cache =>
      cache.writeFragment({ fragment: ProductVariantProductIdFragmentDoc, data: variant }),
    );

    // Assert
    expect(labels(withoutCache)).toEqual(["Copy variant ID"]);
    expect(labels(withCache)).toEqual(["Copy variant ID", "Copy product ID"]);
    expect(withCache.map(action => action.section)).toEqual(["This variant", "This variant"]);
  });

  it("uses dashboard names for API-named entities", () => {
    // Arrange & Act
    const actions = renderActions("/models/UGFnZTox");

    // Assert
    expect(labels(actions)).toEqual(["Copy model ID"]);
    expect(actions[0].section).toEqual("This model");
  });

  it("offers nothing on list and create pages", () => {
    // Arrange & Act
    const list = renderActions("/orders");
    const create = renderActions("/products/add");

    // Assert
    expect(list).toEqual([]);
    expect(create).toEqual([]);
  });

  it("copies the decoded global ID, notifies and tracks the view", async () => {
    // Arrange
    const [copyVariantId] = renderActions(`/products/variant/${encodeURIComponent(VARIANT_ID)}`);

    // Act
    copyVariantId.onSelect({ view: null, params: {} });

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(VARIANT_ID);
    expect(mockTrackEvent).toHaveBeenCalledWith("command_palette_copy_id", {
      view: "PRODUCT_VARIANT_DETAILS",
    });
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ status: "success", text: VARIANT_ID }),
      ),
    );
  });

  it("shows an error toast when the clipboard rejects", async () => {
    // Arrange
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockRejectedValue(new Error("denied")) },
    });

    const [copyOrderId] = renderActions(`/orders/${encodeURIComponent(ORDER_ID)}`);

    // Act
    copyOrderId.onSelect({ view: null, params: {} });

    // Assert
    await waitFor(() =>
      expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ status: "error" })),
    );
  });
});
