import StatusLabel from "@saleor/components/StatusLabel";
import useDateLocalize from "@saleor/hooks/useDateLocalize";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export const ProductAvailabilityStatusLabel = ({ channel }) => {
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
            ? "success"
            : "alert"
          : "error"
      }
    />
  );
};

export default ProductAvailabilityStatusLabel;
