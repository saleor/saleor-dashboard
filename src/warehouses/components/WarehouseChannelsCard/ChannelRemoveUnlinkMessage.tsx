import { messages } from "@dashboard/warehouses/messages";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

/** Body of the remove-channel confirmation: which shipping zones lose their link. */
export const ChannelRemoveUnlinkMessage = ({
  zoneNames,
  truncated,
}: {
  zoneNames: string[];
  /** The warehouse has more zones than were loaded, so others may unlink too. */
  truncated: boolean;
}): ReactNode => {
  const intl = useIntl();

  if (zoneNames.length === 0) {
    return <FormattedMessage {...messages.channelsRemoveUnlinkUnknown} />;
  }

  return (
    <>
      <FormattedMessage
        {...messages.channelsRemoveUnlink}
        values={{ zones: intl.formatList(zoneNames, { type: "conjunction" }) }}
      />
      {truncated ? (
        <>
          {" "}
          <FormattedMessage {...messages.channelsRemoveUnlinkMore} />
        </>
      ) : null}
    </>
  );
};
