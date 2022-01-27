import useDateLocalize from "@saleor/hooks/useDateLocalize";
import { Pill } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

export const AvailabilityStatusLabel = ({ channel, messages }) => {
  const intl = useIntl();
  const localizeDate = useDateLocalize();

  return (
    <Pill
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
      color={
        channel.publicationDate
          ? channel.isPublished
            ? "success"
            : "warning"
          : "error"
      }
    />
  );
};

export default AvailabilityStatusLabel;
