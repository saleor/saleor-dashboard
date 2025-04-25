import { IFilter } from "@dashboard/components/Filter";
import { CollectionPublished } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { FilterOpts } from "@dashboard/types";
import { createOptionsField } from "@dashboard/utils/filters/fields";
import { Option } from "@saleor/macaw-ui-next";
import { defineMessages, IntlShape } from "react-intl";

export interface CollectionListFilterOpts {
  status: FilterOpts<CollectionPublished>;
  channel: FilterOpts<string> & { choices: Option[] };
}

export enum CollectionFilterKeys {
  status = "status",
  channel = "channel",
}

const messages = defineMessages({
  hidden: {
    id: "9eC0MZ",
    defaultMessage: "Hidden",
    description: "collection",
  },
  published: {
    id: "lL3YJO",
    defaultMessage: "Published",
    description: "collection",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: CollectionListFilterOpts,
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
            value: CollectionPublished.PUBLISHED,
          },
          {
            label: intl.formatMessage(messages.hidden),
            value: CollectionPublished.HIDDEN,
          },
        ],
      ),
      active: opts.status.active,
      dependencies: [CollectionFilterKeys.channel],
    },
    {
      ...createOptionsField(
        CollectionFilterKeys.channel,
        intl.formatMessage(commonMessages.channel),
        [opts.channel?.value],
        false,
        opts.channel?.choices,
      ),
      active: opts.channel?.active,
    },
  ];
}
