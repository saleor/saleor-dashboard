import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Typography } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { extraInfoMessages } from "./messages";
import useStyles from "./styles";

interface ExtraInfoLinesProps {
  fulfillment?: OrderDetailsFragment["fulfillments"][0];
}

const ExtraInfoLines: React.FC<ExtraInfoLinesProps> = ({ fulfillment }) => {
  const intl = useIntl();
  const classes = useStyles({});

  if (!fulfillment || !fulfillment?.warehouse || !fulfillment?.trackingNumber) {
    return null;
  }

  const { warehouse, trackingNumber, status } = fulfillment;

  return (
    <Box
      paddingY={4}
      borderColor="default1"
      borderBottomStyle={"solid"}
      borderBottomWidth={1}
    >
      <Typography color="textSecondary" variant="body2">
        {warehouse && (
          <>
            {intl.formatMessage(
              status === FulfillmentStatus.RETURNED
                ? extraInfoMessages.restocked
                : extraInfoMessages.fulfilled,
            )}
            <Typography
              className={clsx(classes.infoLabel, {
                [classes.infoLabelWithMargin]: !!trackingNumber,
              })}
              color="textPrimary"
              variant="body2"
            >
              {getStringOrPlaceholder(warehouse?.name)}
            </Typography>
          </>
        )}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        {trackingNumber && (
          <FormattedMessage
            {...extraInfoMessages.tracking}
            values={{
              trackingNumber: (
                <Typography
                  data-test-id="tracking-number-set"
                  className={classes.infoLabel}
                  color="textPrimary"
                  variant="body2"
                >
                  {trackingNumber}
                </Typography>
              ),
            }}
          />
        )}
      </Typography>
    </Box>
  );
};

export default ExtraInfoLines;
