import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import Date from "@dashboard/components/Date";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import Money from "@dashboard/components/Money";
import Percent from "@dashboard/components/Percent";
import { SaleDetailsFragment, SaleType } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ChannelProps } from "@dashboard/types";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import useStyles from "./styles";

export interface SaleSummaryProps extends ChannelProps {
  sale: SaleDetailsFragment;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({ selectedChannelId, sale }) => {
  const classes = useStyles();
  const intl = useIntl();
  const channel = sale?.channelListings?.find(listing => listing.channel.id === selectedChannelId);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(commonMessages.summary)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text fontWeight="medium" fontSize={3}>
          <FormattedMessage id="F56hOz" defaultMessage="Name" description="sale name" />
        </Text>
        <Text className={classes.ellipsis}>
          {maybe<React.ReactNode>(() => sale.name, <Skeleton />)}
        </Text>
        <FormSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage id="XZR590" defaultMessage="Value" description="sale value" />
        </Text>
        <Text>
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
        </Text>

        <CardSpacer />
        <Hr />
        <CardSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage {...commonMessages.startDate} />
        </Text>
        <Text>
          {maybe<React.ReactNode>(
            () => (
              <Date date={sale.startDate} plain />
            ),
            <Skeleton />,
          )}
        </Text>
        <FormSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage {...commonMessages.endDate} />
        </Text>
        <Text>
          {maybe<React.ReactNode>(
            () => (sale.endDate === null ? "-" : <Date date={sale.endDate} plain />),
            <Skeleton />,
          )}
        </Text>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

SaleSummary.displayName = "SaleSummary";
export default SaleSummary;
