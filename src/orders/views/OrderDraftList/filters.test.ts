import { FilterElement } from "@dashboard/components/ConditionalFilter/FilterElement";
import { OrderDraftListUrlFilters } from "@dashboard/orders/urls";
import { getExistingKeys } from "@test/filters";

import { getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: OrderDraftListUrlFilters = {};
    const filterVariables = getFilterVariables({
      params,
      filterContainer: [FilterElement.createEmpty()],
    });

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });
  it("should not be empty object if params given", () => {
    const params: OrderDraftListUrlFilters = {
      query: "test",
    };
    const filterVariables = getFilterVariables({
      params,
      filterContainer: [
        FilterElement.createStaticBySlug("created"),
        FilterElement.createStaticBySlug("customer"),
      ],
    });

    expect(getExistingKeys(filterVariables)).toHaveLength(3);
  });
});
