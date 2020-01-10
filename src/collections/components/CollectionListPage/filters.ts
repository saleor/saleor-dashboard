import { defineMessages, IntlShape } from "react-intl";

import { commonMessages } from "@saleor/intl";
import { FilterOpts } from "@saleor/types";
import { CollectionPublished } from "@saleor/types/globalTypes";
import { IFilter } from "@saleor/components/Filter";
import { createOptionsField } from "@saleor/utils/filters/fields";

export interface CollectionListFilterOpts {
  status: FilterOpts<CollectionPublished>;
}

export enum CollectionFilterKeys {
  status = "status"
}

const messages = defineMessages({
  hidden: {
    defaultMessage: "Hidden",
    description: "collection"
  },
  published: {
    defaultMessage: "Published",
    description: "collection"
  }
});

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
