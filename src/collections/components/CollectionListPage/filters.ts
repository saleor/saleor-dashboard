import { IFilter } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { CollectionPublished } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { FilterOpts } from "@saleor/types";
import { createOptionsField } from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export interface CollectionListFilterOpts {
  status: FilterOpts<CollectionPublished>;
  channel: FilterOpts<string> & { choices: MultiAutocompleteChoiceType[] };
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
