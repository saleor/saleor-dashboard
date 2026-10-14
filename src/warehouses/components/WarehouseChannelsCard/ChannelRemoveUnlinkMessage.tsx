import { messages } from "@dashboard/warehouses/messages";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

/** Zones named before the rest collapse into a count, so the dialog stays readable. */
const NAMED_ZONE_LIMIT = 5;

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

  const named = zoneNames.slice(0, NAMED_ZONE_LIMIT);
  const otherCount = zoneNames.length - named.length;
  const items =
    otherCount > 0
      ? [...named, intl.formatMessage(messages.channelsRemoveUnlinkOthers, { count: otherCount })]
      : named;

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
