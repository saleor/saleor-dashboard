import { createFilterStructure } from "@dashboard/collections/components/CollectionListPage";
import { CollectionListUrlFilters } from "@dashboard/collections/urls";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import { CollectionPublished } from "@dashboard/graphql";
import { FilterOpts } from "@dashboard/types";
import { getFilterQueryParams } from "@dashboard/utils/filters";
import { stringifyQs } from "@dashboard/utils/urls";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: CollectionListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });
  it("should not be empty object if params given", () => {
    const params: CollectionListUrlFilters = {
      status: CollectionPublished.PUBLISHED,
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
      value: CollectionPublished.PUBLISHED,
    },
    channel: undefined as unknown as FilterOpts<string> & {
      choices: MultiAutocompleteChoiceType[];
    },
  });

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(filters, getFilterQueryParam);

    expect(getExistingKeys(filterQueryParams)).toHaveLength(0);
  });
  it("should not be empty if active filters are present", () => {
    const filters = createFilterStructure(intl, {
      status: {
        active: true,
        value: CollectionPublished.PUBLISHED,
      },
      channel: undefined as unknown as FilterOpts<string> & {
        choices: MultiAutocompleteChoiceType[];
      },
    });
    const filterQueryParams = getFilterQueryParams(
      setFilterOptsStatus(filters, true),
      getFilterQueryParam,
    );

    expect(filterQueryParams).toMatchSnapshot();
    expect(stringifyQs(filterQueryParams)).toMatchSnapshot();
  });
});
