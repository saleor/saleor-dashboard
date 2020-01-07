import { IntlShape } from "react-intl";

import {
  CollectionFilterInput,
  CollectionPublished
} from "@saleor/types/globalTypes";
import { IFilterElement, IFilter } from "@saleor/components/Filter";
import { maybe, findValueInEnum } from "@saleor/misc";
import { createOptionsField } from "@saleor/utils/filters/fields";
import { commonMessages } from "@saleor/intl";
import { CollectionListFilterOpts } from "../../types";
import {
  CollectionListUrlFilters,
  CollectionListUrlFiltersEnum,
  CollectionListUrlQueryParams
} from "../../urls";
import {
  createFilterTabUtils,
  createFilterUtils
} from "../../../utils/filters";
import messages from "./messages";

export const COLLECTION_FILTERS_KEY = "collectionFilters";

export enum CollectionFilterKeys {
  status = "status"
}

export function getFilterOpts(
  params: CollectionListUrlFilters
): CollectionListFilterOpts {
  return {
    status: {
      active: maybe(() => params.status !== undefined, false),
      value: maybe(() => findValueInEnum(status, CollectionPublished))
    }
  };
}

export function createFilterStructure(
  intl: IntlShape,
  opts: CollectionListFilterOpts
): IFilter<CollectionFilterKeys> {
  return [
    {
      ...createOptionsField(
        CollectionFilterKeys.status,
        intl.formatMessage(commonMessages.status),
        [opts.status.value],
        false,
        [
          {
            label: intl.formatMessage(messages.published),
            value: CollectionPublished.PUBLISHED
          },
          {
            label: intl.formatMessage(messages.hidden),
            value: CollectionPublished.HIDDEN
          }
        ]
      ),
      active: opts.status.active
    }
  ];
}

export function getFilterVariables(
  params: CollectionListUrlFilters
): CollectionFilterInput {
  return {
    published: params.status
      ? findValueInEnum(params.status, CollectionPublished)
      : undefined,
    search: params.query
  };
}

export function getFilterQueryParam(
  filter: IFilterElement<CollectionFilterKeys>
): CollectionListUrlFilters {
  const { active, name, value } = filter;

  switch (name) {
    case CollectionFilterKeys.status:
      if (!active) {
        return {
          status: undefined
        };
      }

      return {
        status: value[0]
      };
  }
}

export const {
  deleteFilterTab,
  getFilterTabs,
  saveFilterTab
} = createFilterTabUtils<CollectionListUrlFilters>(COLLECTION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters } = createFilterUtils<
  CollectionListUrlQueryParams,
  CollectionListUrlFilters
>(CollectionListUrlFiltersEnum);
