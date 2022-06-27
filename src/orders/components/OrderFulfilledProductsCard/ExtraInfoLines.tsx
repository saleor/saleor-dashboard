import { TableCell, TableRow, Typography } from "@material-ui/core";
import { FulfillmentStatus, OrderDetailsFragment } from "@saleor/graphql";
import { getStringOrPlaceholder } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { extraInfoMessages } from "./messages";
import useStyles from "./styles";

const NUMBER_OF_COLUMNS = 5;

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
    <TableRow>
      <TableCell className={classes.infoRow} colSpan={NUMBER_OF_COLUMNS}>
        <Typography color="textSecondary" variant="body2">
          {warehouse && (
            <>
              {intl.formatMessage(
                status === FulfillmentStatus.RETURNED
                  ? extraInfoMessages.restocked
                  : extraInfoMessages.fulfilled,
              )}
              <Typography
                className={classNames(classes.infoLabel, {
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
      </TableCell>
    </TableRow>
  );
};

export default ExtraInfoLines;
