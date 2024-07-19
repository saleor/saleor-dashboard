import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import Date from "@dashboard/components/Date";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import Money from "@dashboard/components/Money";
import Percent from "@dashboard/components/Percent";
import { DiscountValueTypeEnum, VoucherDetailsFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ChannelProps } from "@dashboard/types";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { translateVoucherTypes } from "../../translations";

export interface VoucherSummaryProps extends ChannelProps {
  voucher: VoucherDetailsFragment;
}

const VoucherSummary: React.FC<VoucherSummaryProps> = ({ selectedChannelId, voucher }) => {
  const intl = useIntl();
  const translatedVoucherTypes = translateVoucherTypes(intl);
  const channel = voucher?.channelListings?.find(
    listing => listing.channel.id === selectedChannelId,
  );

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(commonMessages.summary)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text fontWeight="medium" fontSize={3}>
          <FormattedMessage id="bcf60I" defaultMessage="Applies to" description="voucher" />
        </Text>
        <Text>
          {maybe<React.ReactNode>(() => translatedVoucherTypes[voucher.type], <Skeleton />)}
        </Text>
        <FormSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage id="JV+EiM" defaultMessage="Value" description="voucher value" />
        </Text>
        <Text>
          {voucher ? (
            voucher.discountValueType === DiscountValueTypeEnum.FIXED && channel?.discountValue ? (
              <Money
                money={{
                  amount: channel?.discountValue,
                  currency: channel?.channel.currencyCode,
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
          {intl.formatMessage(commonMessages.startDate)}
        </Text>
        <Text>
          {maybe<React.ReactNode>(
            () => (
              <Date date={voucher.startDate} plain />
            ),
            <Skeleton />,
          )}
        </Text>
        <FormSpacer />

        <Text size={2} fontWeight="light">
          {intl.formatMessage(commonMessages.endDate)}
        </Text>
        <Text>
          {maybe<React.ReactNode>(
            () => (voucher.endDate === null ? "-" : <Date date={voucher.endDate} plain />),
            <Skeleton />,
          )}
        </Text>

        <CardSpacer />
        <Hr />
        <CardSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage
            id="FOa+Xd"
            defaultMessage="Min. Order Value"
            description="voucher value requirement"
          />
        </Text>
        <Text>
          {voucher ? channel?.minSpent ? <Money money={channel.minSpent} /> : "-" : <Skeleton />}
        </Text>
        <FormSpacer />

        <Text size={2} fontWeight="light">
          <FormattedMessage
            id="HLqWXA"
            defaultMessage="Usage Limit"
            description="voucher value requirement"
          />
        </Text>
        <Text>
          {maybe<React.ReactNode>(
            () => (voucher.usageLimit === null ? "-" : voucher.usageLimit),
            <Skeleton />,
          )}
        </Text>
        <FormSpacer />
        <Text size={2} fontWeight="light">
          <FormattedMessage id="h65vZI" defaultMessage="Used" description="times voucher used" />
        </Text>
        <Text>{voucher?.used ?? <Skeleton />}</Text>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

VoucherSummary.displayName = "VoucherSummary";
export default VoucherSummary;
