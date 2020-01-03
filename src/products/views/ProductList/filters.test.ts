import { StockAvailability } from "@saleor/types/globalTypes";
import { getFilterVariables } from "./filters";

test("Get filter variables", () => {
  const filter = getFilterVariables({
    priceFrom: "10",
    priceTo: "20",
    status: "true",
    stockStatus: StockAvailability.IN_STOCK
  });

  expect(filter).toMatchSnapshot();
});
