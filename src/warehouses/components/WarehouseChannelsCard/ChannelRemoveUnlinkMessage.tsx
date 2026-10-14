import { cappedListItems } from "@dashboard/utils/cappedList/cappedList";
import { messages } from "@dashboard/warehouses/messages";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

/** Body of the remove-channel confirmation: which shipping zones lose their link. */
export const ChannelRemoveUnlinkMessage = ({
  zoneNames,
}: {
  /** Null when the zones could not be checked. */
  zoneNames: string[] | null;
}): ReactNode => {
  const intl = useIntl();

  if (zoneNames === null) {
    return <FormattedMessage {...messages.channelsRemoveUnlinkUnknown} />;
  }

  const items = cappedListItems({
    items: zoneNames,
    formatOthers: count => intl.formatMessage(messages.channelsRemoveUnlinkOthers, { count }),
  });

  return (
    <FormattedMessage
      {...messages.channelsRemoveUnlink}
      values={{
        count: zoneNames.length,
        zones: intl.formatList(items, { type: "conjunction" }),
      }}
    />
  );
};
