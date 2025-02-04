import { createFilterStructure } from "@dashboard/collections/components/CollectionListPage";
import { CollectionPublished } from "@dashboard/graphql";
import { FilterOpts } from "@dashboard/types";
import { getFilterQueryParams } from "@dashboard/utils/filters";
import { stringifyQs } from "@dashboard/utils/urls";
import { Option } from "@saleor/macaw-ui-next";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParam } from "./filters";

describe("Filtering URL params", () => {
  const intl = createIntl(config);
  const filters = createFilterStructure(intl, {
    status: {
      active: false,
      value: CollectionPublished.PUBLISHED,
    },
    channel: undefined as unknown as FilterOpts<string> & {
      choices: Option[];
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
        choices: Option[];
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
