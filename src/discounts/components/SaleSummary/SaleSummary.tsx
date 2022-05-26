import { Card, CardContent, Typography } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Date from "@saleor/components/Date";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import Money from "@saleor/components/Money";
import Percent from "@saleor/components/Percent";
import Skeleton from "@saleor/components/Skeleton";
import { SaleDetailsFragment, SaleType } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { ChannelProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import useStyles from "./styles";

export interface SaleSummaryProps extends ChannelProps {
  sale: SaleDetailsFragment;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({
  selectedChannelId,
  sale,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const channel = sale?.channelListings?.find(
    listing => listing.channel.id === selectedChannelId,
  );
  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.summary)} />
      <CardContent>
        <Typography variant="caption">
          <FormattedMessage
            id="F56hOz"
            defaultMessage="Name"
            description="sale name"
          />
        </Typography>
        <Typography className={classes.ellipsis}>
          {maybe<React.ReactNode>(() => sale.name, <Skeleton />)}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          <FormattedMessage
            id="XZR590"
            defaultMessage="Value"
            description="sale value"
          />
        </Typography>
        <Typography>
          {sale ? (
            sale.type === SaleType.FIXED && channel?.discountValue ? (
              <Money
                money={{
                  amount: channel?.discountValue,
                  currency: channel?.currency,
                }}
              />
            ) : channel?.discountValue ? (
              <Percent amount={channel?.discountValue} />
            ) : (
              "-"
            )
          ) : (
            <Skeleton />
          )}
        </Typography>

        <CardSpacer />
        <Hr />
        <CardSpacer />

        <Typography variant="caption">
          <FormattedMessage {...commonMessages.startDate} />
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () => (
              <Date date={sale.startDate} plain />
            ),
            <Skeleton />,
          )}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          <FormattedMessage {...commonMessages.endDate} />
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () =>
              sale.endDate === null ? "-" : <Date date={sale.endDate} plain />,
            <Skeleton />,
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};
SaleSummary.displayName = "SaleSummary";
export default SaleSummary;
