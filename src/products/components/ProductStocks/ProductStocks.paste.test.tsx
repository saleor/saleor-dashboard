import { ThemeWrapper } from "@test/themeWrapper";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

import { type ProductStockInput, ProductStocks } from "./ProductStocks";

jest.mock("./StockVisibilityHint", () => ({
  StockVisibilityHint: () => null,
}));

const wrapper = ({ children }: { children: ReactNode }) => <ThemeWrapper>{children}</ThemeWrapper>;

const baseData = {
  sku: "",
  trackInventory: true,
  globalThreshold: "",
  globalSoldUnits: 0,
  hasPreorderEndDate: false,
};

const stocks: ProductStockInput[] = [
  {
    id: "wh-1",
    label: "Warehouse A",
    data: { quantityAllocated: 2 },
    value: "10",
  },
  {
    id: "wh-2",
    label: "Warehouse B",
    data: { quantityAllocated: 0 },
    value: "5",
  },
];

describe("ProductStocks paste", () => {
  it("pastes a column of stock quantities down the warehouse list", () => {
    // Arrange
    const onStocksReplace = jest.fn();

    render(
      <ProductStocks
        data={baseData}
        loading={false}
        hasVariants
        errors={[]}
        stocks={stocks}
        productVariantChannelListings={[{ id: "ch-1", name: "USD", currency: "USD" }]}
        warehouses={[]}
        hasMoreWarehouses={false}
        onChange={jest.fn()}
        onStocksReplace={onStocksReplace}
        onFormDataChange={jest.fn()}
        onWarehouseStockAdd={jest.fn()}
        onWarehouseStockDelete={jest.fn()}
        onWarehouseConfigure={jest.fn()}
        fetchMoreWarehouses={jest.fn()}
        isCreate={false}
        searchWarehouses={jest.fn()}
      />,
      { wrapper },
    );

    const quantityInputs = screen.getAllByTestId("stock-input");

    // Act — paste on the input (matches browser focus target)
    fireEvent.paste(quantityInputs[0], {
      clipboardData: {
        getData: () => "100\n250",
      },
    });

    // Assert — rows are sorted by warehouse name
    expect(onStocksReplace).toHaveBeenCalledWith([
      {
        id: "wh-1",
        label: "Warehouse A",
        quantityAllocated: 2,
        value: "100",
      },
      {
        id: "wh-2",
        label: "Warehouse B",
        quantityAllocated: 0,
        value: "250",
      },
    ]);
  });
});
