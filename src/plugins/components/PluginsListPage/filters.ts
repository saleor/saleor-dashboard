import { IFilter } from "@saleor/components/Filter";
import { PluginConfigurationType } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { AutocompleteFilterOpts, FilterOpts } from "@saleor/types";
import {
  createAutocompleteField,
  createBooleanField,
  createOptionsField,
} from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

import {
  pluginChannelConfigurationCellMessages,
  pluginStatusMessages,
} from "../PluginsList/messages";

export enum PluginFilterKeys {
  active = "active",
  channels = "channels",
  status = "status",
  type = "type",
}

export interface PluginListFilterOpts {
  isActive: FilterOpts<boolean>;
  channels: FilterOpts<string[]> & AutocompleteFilterOpts;
  type: FilterOpts<PluginConfigurationType>;
  status: FilterOpts<boolean>;
}

const messages = defineMessages({
  channelStatusSectionTitle: {
    id: "TC/EOG",
    defaultMessage: "Status in channel",
    description: "status section title",
  },
  channelStatusSectionSubtitle: {
    id: "zQnYKn",
    defaultMessage: "Channel status",
    description: "status section subtitle",
  },
  configTypeSectionTitle: {
    id: "cwoN25",
    defaultMessage: "Configuration Type",
    description: "config type section title",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: PluginListFilterOpts,
): IFilter<PluginFilterKeys> {
  return [
    {
      active: opts.status.active,
      name: PluginFilterKeys.status,
      label: intl.formatMessage(messages.channelStatusSectionTitle),
      multiple: false,
      multipleFields: [
        {
          required: true,
          ...createBooleanField(
            PluginFilterKeys.active,
            intl.formatMessage(messages.channelStatusSectionSubtitle),
            opts.isActive.value,
            {
              negative: intl.formatMessage(pluginStatusMessages.deactivated),
              positive: intl.formatMessage(pluginStatusMessages.active),
            },
          ),
        },
        {
          required: true,
          ...createAutocompleteField(
            PluginFilterKeys.channels,
            intl.formatMessage(sectionNames.channels),
            opts.channels.value,
            opts.channels.displayValues,
            true,
            opts.channels.choices,
            {
              hasMore: opts.channels.hasMore,
              initialSearch: "",
              loading: opts.channels.loading,
              onFetchMore: opts.channels.onFetchMore,
              onSearchChange: opts.channels.onSearchChange,
            },
          ),
        },
      ],
    },
    {
      active: opts.type.active,
      name: PluginFilterKeys.type,
      ...createOptionsField(
        PluginFilterKeys.type,
        intl.formatMessage(messages.configTypeSectionTitle),
        [],
        false,
        [
          {
            value: PluginConfigurationType.GLOBAL,
            label: intl.formatMessage(
              pluginChannelConfigurationCellMessages.globalLabel,
            ),
          },
          {
            value: PluginConfigurationType.PER_CHANNEL,
            label: intl.formatMessage(
              pluginChannelConfigurationCellMessages.channelLabel,
            ),
          },
        ],
      ),
    },
  ];
}
