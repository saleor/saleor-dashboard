import { createIntl } from "react-intl";
import { stringify as stringifyQs } from "qs";

import { CollectionListUrlFilters } from "@saleor/collections/urls";
import { createFilterStructure } from "@saleor/collections/components/CollectionListPage";
import { getFilterQueryParams } from "@saleor/utils/filters";
import { CollectionPublished } from "@saleor/types/globalTypes";
import { config } from "@test/intl";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { getFilterVariables, getFilterQueryParam } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: CollectionListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });

  it("should not be empty object if params given", () => {
    const params: CollectionListUrlFilters = {
      status: CollectionPublished.PUBLISHED
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(1);
  });
});

describe("Filtering URL params", () => {
  const intl = createIntl(config);

  const filters = createFilterStructure(intl, {
    status: {
      active: false,
      value: CollectionPublished.PUBLISHED
    }
  });

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(
      filters,
      getFilterQueryParam
    );

    expect(getExistingKeys(filterQueryParams)).toHaveLength(0);
  });

  it("should not be empty if active filters are present", () => {
    const filters = createFilterStructure(intl, {
      status: {
        active: true,
        value: CollectionPublished.PUBLISHED
      }
    });

    const filterQueryParams = getFilterQueryParams(
      setFilterOptsStatus(filters, true),
      getFilterQueryParam
    );

    expect(filterQueryParams).toMatchSnapshot();
    expect(stringifyQs(filterQueryParams)).toMatchSnapshot();
  });
});
