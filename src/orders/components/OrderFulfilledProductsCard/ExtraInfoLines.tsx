import { FulfillmentStatus, OrderDetailsFragment } from "@dashboard/graphql";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
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
    <Box paddingY={4} borderColor="default1" borderBottomStyle={"solid"} borderBottomWidth={1}>
      <Text color="default2" fontSize={3}>
        {warehouse && (
          <>
            {intl.formatMessage(
              status === FulfillmentStatus.RETURNED
                ? extraInfoMessages.restocked
                : extraInfoMessages.fulfilled,
            )}
            <Text
              className={clsx(classes.infoLabel, {
                [classes.infoLabelWithMargin]: !!trackingNumber,
              })}
              color="default1"
              fontSize={3}
            >
              {getStringOrPlaceholder(warehouse?.name)}
            </Text>
          </>
        )}
      </Text>
      <Text color="default2" fontSize={3}>
        {trackingNumber && (
          <FormattedMessage
            {...extraInfoMessages.tracking}
            values={{
              trackingNumber: (
                <Text
                  data-test-id="tracking-number-set"
                  className={classes.infoLabel}
                  color="default1"
                  fontSize={3}
                >
                  {trackingNumber}
                </Text>
              ),
            }}
          />
        )}
      </Text>
    </Box>
  );
};

export default ExtraInfoLines;
