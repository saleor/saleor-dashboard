import { makeStyles, TableCell, TableRow, Typography } from "@material-ui/core";
import { getStringOrPlaceholder } from "@saleor/misc";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import { OrderDetails_order_fulfillments } from "../../types/OrderDetails";

const useStyles = makeStyles(
  theme => ({
    infoLabel: {
      display: "inline-block"
    },
    infoLabelWithMargin: {
      marginBottom: theme.spacing()
    },
    infoRow: {
      padding: theme.spacing(2, 3)
    }
  }),
  { name: "ExtraInfoLines" }
);

const NUMBER_OF_COLUMNS = 5;

interface ExtraInfoLinesProps {
  fulfillment?: OrderDetails_order_fulfillments;
}

const ExtraInfoLines: React.FC<ExtraInfoLinesProps> = ({ fulfillment }) => {
  const classes = useStyles({});

  if (!fulfillment) {
    return null;
  }

  const { warehouse, trackingNumber } = fulfillment;

  return (
    <TableRow>
      <TableCell className={classes.infoRow} colSpan={NUMBER_OF_COLUMNS}>
        <Typography color="textSecondary" variant="body2">
          {warehouse && (
            <FormattedMessage
              defaultMessage="Fulfilled from: {warehouseName}"
              description="fulfillment group"
              values={{
                warehouseName: (
                  <Typography
                    className={classNames(classes.infoLabel, {
                      [classes.infoLabelWithMargin]: !!trackingNumber
                    })}
                    color="textPrimary"
                    variant="body2"
                  >
                    {getStringOrPlaceholder(warehouse?.name)}
                  </Typography>
                )
              }}
            />
          )}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {trackingNumber && (
            <FormattedMessage
              defaultMessage="Tracking Number: {trackingNumber}"
              values={{
                trackingNumber: (
                  <Typography
                    className={classes.infoLabel}
                    color="textPrimary"
                    variant="body2"
                  >
                    {trackingNumber}
                  </Typography>
                )
              }}
            />
          )}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default ExtraInfoLines;
