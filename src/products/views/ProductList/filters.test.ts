import { createIntl } from "react-intl";

import { ProductFilterKeys } from "@saleor/products/components/ProductListFilter";
import { StockAvailability } from "@saleor/types/globalTypes";
import { createFilter, createFilterChips, getFilterVariables } from "./filters";

const mockIntl = createIntl({
  locale: "en"
});

describe("Create filter object", () => {
  it("with price", () => {
    const filter = createFilter({
      name: ProductFilterKeys.priceEqual,
      value: "10"
    });

    expect(filter).toMatchSnapshot();
  });

  it("with price range", () => {
    const filter = createFilter({
      name: ProductFilterKeys.priceEqual,
      value: ["10", "20"]
    });

    expect(filter).toMatchSnapshot();
  });

  it("with publication status", () => {
    const filter = createFilter({
      name: ProductFilterKeys.published,
      value: "false"
    });

    expect(filter).toMatchSnapshot();
  });

  it("with stock status", () => {
    const filter = createFilter({
      name: ProductFilterKeys.stock,
      value: StockAvailability.OUT_OF_STOCK
    });

    expect(filter).toMatchSnapshot();
  });
});

test("Crate filter chips", () => {
  const chips = createFilterChips(
    {
      isPublished: "true",
      priceFrom: "10",
      priceTo: "20",
      status: StockAvailability.IN_STOCK
    },
    {
      currencySymbol: "USD",
      locale: "en"
    },
    jest.fn(),
    mockIntl as any
  );

  expect(chips).toMatchSnapshot();
});

test("Get filter variables", () => {
  const filter = getFilterVariables({
    isPublished: "true",
    priceFrom: "10",
    priceTo: "20",
    status: StockAvailability.IN_STOCK
  });

  expect(filter).toMatchSnapshot();
});
