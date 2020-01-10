import { IntlShape, defineMessages } from "react-intl";

import { FilterOpts } from "@saleor/types";
import { StaffMemberStatus } from "@saleor/types/globalTypes";
import { IFilter } from "@saleor/components/Filter";
import { createOptionsField } from "@saleor/utils/filters/fields";

export enum StaffFilterKeys {
  status = "status"
}

export interface StaffListFilterOpts {
  status: FilterOpts<StaffMemberStatus>;
}

const messages = defineMessages({
  active: {
    defaultMessage: "Active",
    description: "staff member's account"
  },
  deactivated: {
    defaultMessage: "Deactivated",
    description: "staff member's account"
  },
  status: {
    defaultMessage: "Status",
    description: "staff member's account"
  }
});

export function createFilterStructure(
  intl: IntlShape,
  opts: StaffListFilterOpts
): IFilter<StaffFilterKeys> {
  return [
    {
      ...createOptionsField(
        StaffFilterKeys.status,
        intl.formatMessage(messages.status),
        [opts.status.value],
        false,
        [
          {
            label: intl.formatMessage(messages.active),
            value: StaffMemberStatus.ACTIVE
          },
          {
            label: intl.formatMessage(messages.deactivated),
            value: StaffMemberStatus.DEACTIVATED
          }
        ]
      ),
      active: opts.status.active
    }
  ];
}
