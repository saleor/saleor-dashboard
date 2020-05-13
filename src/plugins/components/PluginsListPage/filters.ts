import { IFilter } from "@saleor/components/Filter";
import { commonMessages } from "@saleor/intl";
import { FilterOpts } from "@saleor/types";
import { createBooleanField } from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum PluginFilterKeys {
  active = "active"
}

export interface PluginListFilterOpts {
  isActive: FilterOpts<boolean>;
}

const messages = defineMessages({
  active: {
    defaultMessage: "Active",
    description: "plugin"
  },
  deactivated: {
    defaultMessage: "Inactive",
    description: "plugin"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: PluginListFilterOpts
): IFilter<PluginFilterKeys> {
  return [
    {
      ...createBooleanField(
        PluginFilterKeys.active,
        intl.formatMessage(commonMessages.status),
        opts.isActive.value,
        {
          negative: intl.formatMessage(messages.deactivated),
          positive: intl.formatMessage(messages.active)
        }
      ),
      active: opts.isActive.active
    }
  ];
}
