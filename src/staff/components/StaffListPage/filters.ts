import { IFilter } from "@dashboard/components/Filter";
import { StaffMemberStatus } from "@dashboard/graphql";
import { FilterOpts } from "@dashboard/types";
import { createOptionsField } from "@dashboard/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum StaffFilterKeys {
  status = "status",
}

export interface StaffListFilterOpts {
  status: FilterOpts<StaffMemberStatus>;
}

const messages = defineMessages({
  active: {
    id: "HR9OTW",
    defaultMessage: "Active",
    description: "staff member's account",
  },
  deactivated: {
    id: "Fc3O3r",
    defaultMessage: "Deactivated",
    description: "staff member's account",
  },
  status: {
    id: "utaSh3",
    defaultMessage: "Status",
    description: "staff member's account",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: StaffListFilterOpts,
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
            value: StaffMemberStatus.ACTIVE,
          },
          {
            label: intl.formatMessage(messages.deactivated),
            value: StaffMemberStatus.DEACTIVATED,
          },
        ],
      ),
      active: opts.status.active,
    },
  ];
}
