import * as graphql from "@dashboard/graphql";
import { render } from "@testing-library/react";

import { messages } from "./messages";
import { StockVisibilityHint } from "./StockVisibilityHint";

jest.mock("@dashboard/graphql", () => ({
  useStockVisibilityModeQuery: jest.fn(),
}));

const mockUseStockVisibilityModeQuery = graphql.useStockVisibilityModeQuery as jest.Mock;

const renderHint = () => render(<StockVisibilityHint />);

const buildResult = (data: unknown) => ({ data, loading: false, error: undefined });

describe("StockVisibilityHint", () => {
  beforeEach(() => {
    mockUseStockVisibilityModeQuery.mockReset();
  });

  it("renders nothing while the mode query is still loading", () => {
    mockUseStockVisibilityModeQuery.mockReturnValue(buildResult(undefined));

    const { queryByTestId } = renderHint();

    expect(queryByTestId("stock-visibility-hint")).toBeNull();
  });

  it("renders nothing when the shop payload is unexpectedly absent", () => {
    mockUseStockVisibilityModeQuery.mockReturnValue(buildResult({ shop: null }));

    const { queryByTestId } = renderHint();

    expect(queryByTestId("stock-visibility-hint")).toBeNull();
  });

  it("renders the legacy-mode copy when useLegacyShippingZoneStockAvailability is true", () => {
    mockUseStockVisibilityModeQuery.mockReturnValue(
      buildResult({
        shop: {
          __typename: "Shop",
          id: "shop-1",
          useLegacyShippingZoneStockAvailability: true,
        },
      }),
    );

    const { getByTestId, getByText } = renderHint();

    expect(getByTestId("stock-visibility-hint")).toBeInTheDocument();
    expect(getByText(messages.stockVisibilityHintLegacy.defaultMessage)).toBeInTheDocument();
  });

  it("renders the direct-mode copy when useLegacyShippingZoneStockAvailability is false", () => {
    mockUseStockVisibilityModeQuery.mockReturnValue(
      buildResult({
        shop: {
          __typename: "Shop",
          id: "shop-1",
          useLegacyShippingZoneStockAvailability: false,
        },
      }),
    );

    const { getByTestId, getByText } = renderHint();

    expect(getByTestId("stock-visibility-hint")).toBeInTheDocument();
    expect(getByText(messages.stockVisibilityHintDirect.defaultMessage)).toBeInTheDocument();
  });
});
