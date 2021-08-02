import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { CardSpacer } from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import React, { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderDetails_order_metadata } from "../../types/OrderDetails";

interface Props {
  metadata: OrderDetails_order_metadata[];
}

const CancelKeys = {
  CUSTOM_REASON: "cancellation_choice_custom_value",
  REASON: "cancellation_reason"
};

const OrderCustomerCancelDetails: React.FC<Props> = ({ metadata }) => {
  const intl = useIntl();

  const cancelReasonsMetadata = metadata
    .filter(({ key }) =>
      [CancelKeys.REASON, CancelKeys.CUSTOM_REASON].includes(key)
    )
    .sort(({ key }) => {
      if (key === CancelKeys.REASON) {
        return -1;
      }

      return 0;
    });

  const LABELS = {
    [CancelKeys.REASON]: intl.formatMessage({
      defaultMessage: "Reason",
      description: "order cancellation reason"
    }),
    [CancelKeys.CUSTOM_REASON]: intl.formatMessage({
      defaultMessage: "Custom Response",
      description: "order cancellation custom reason"
    })
  };

  return (
    <Fragment>
      <CardSpacer />
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Cancellation details",
            description: "customer cancellation details"
          })}
        />
        <CardContent>
          {cancelReasonsMetadata.length ? (
            cancelReasonsMetadata.map(({ key, value }) => (
              <Fragment key={key}>
                <Typography style={{ fontWeight: 600 }}>
                  {LABELS[key].toUpperCase()}
                </Typography>
                <Typography>{value || "-"}</Typography>
                <CardSpacer />
              </Fragment>
            ))
          ) : (
            <Typography color="textSecondary">
              <FormattedMessage defaultMessage="No details available" />
            </Typography>
          )}
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default OrderCustomerCancelDetails;
