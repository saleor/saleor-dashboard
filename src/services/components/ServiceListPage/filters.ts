import { IFilter } from "@saleor/components/Filter";
import { commonMessages } from "@saleor/intl";
import { FilterOpts } from "@saleor/types";
import { createBooleanField } from "@saleor/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum ServiceFilterKeys {
  active = "active"
}

export interface ServiceListFilterOpts {
  isActive: FilterOpts<boolean>;
}

const messages = defineMessages({
  active: {
    defaultMessage: "Active",
    description: "service account"
  },
  deactivated: {
    defaultMessage: "Inactive",
    description: "service account"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: ServiceListFilterOpts
): IFilter<ServiceFilterKeys> {
  return [
    {
      ...createBooleanField(
        ServiceFilterKeys.active,
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

export default messages;
