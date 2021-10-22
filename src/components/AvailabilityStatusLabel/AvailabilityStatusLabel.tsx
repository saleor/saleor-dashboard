import StatusLabel from "@saleor/components/StatusLabel";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import React from "react";
import { useIntl } from "react-intl";

import { StatusType } from "../StatusChip/types";

export const AvailabilityStatusLabel = ({ channel, messages }) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <StatusLabel
      label={intl.formatMessage(
        channel.publicationDate
          ? channel.isPublished
            ? messages.published
            : messages.willBePublished
          : messages.unpublished,
        {
          date: localizeDate(channel.publicationDate, "L")
        }
      )}
      status={
        channel.publicationDate
          ? channel.isPublished
            ? StatusType.SUCCESS
            : StatusType.ALERT
          : StatusType.ERROR
      }
    />
  );
};

export default AvailabilityStatusLabel;
