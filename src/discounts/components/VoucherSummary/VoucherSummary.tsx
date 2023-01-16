import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Date from "@dashboard/components/Date";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import Money from "@dashboard/components/Money";
import Percent from "@dashboard/components/Percent";
import Skeleton from "@dashboard/components/Skeleton";
import {
  DiscountValueTypeEnum,
  VoucherDetailsFragment,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { ChannelProps } from "@dashboard/types";
import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { translateVoucherTypes } from "../../translations";
import useStyles from "./styles";

export interface VoucherSummaryProps extends ChannelProps {
  voucher: VoucherDetailsFragment;
}

const VoucherSummary: React.FC<VoucherSummaryProps> = ({
  selectedChannelId,
  voucher,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  const translatedVoucherTypes = translateVoucherTypes(intl);
  const channel = voucher?.channelListings?.find(
    listing => listing.channel.id === selectedChannelId,
  );

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.summary)} />
      <CardContent>
        <Typography variant="caption">
          <FormattedMessage
            id="JsPIOX"
            defaultMessage="Code"
            description="voucher code"
          />
        </Typography>
        <Typography className={classes.ellipsis}>
          {maybe<React.ReactNode>(() => voucher.code, <Skeleton />)}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          <FormattedMessage
            id="bcf60I"
            defaultMessage="Applies to"
            description="voucher"
          />
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () => translatedVoucherTypes[voucher.type],
            <Skeleton />,
          )}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          <FormattedMessage
            id="JV+EiM"
            defaultMessage="Value"
            description="voucher value"
          />
        </Typography>
        <Typography>
          {voucher ? (
            voucher.discountValueType === DiscountValueTypeEnum.FIXED &&
            channel?.discountValue ? (
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
        </Typography>

        <CardSpacer />
        <Hr />
        <CardSpacer />

        <Typography variant="caption">
          {intl.formatMessage(commonMessages.startDate)}
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () => (
              <Date date={voucher.startDate} plain />
            ),
            <Skeleton />,
          )}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          {intl.formatMessage(commonMessages.endDate)}
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () =>
              voucher.endDate === null ? (
                "-"
              ) : (
                <Date date={voucher.endDate} plain />
              ),
            <Skeleton />,
          )}
        </Typography>

        <CardSpacer />
        <Hr />
        <CardSpacer />

        <Typography variant="caption">
          <FormattedMessage
            id="FOa+Xd"
            defaultMessage="Min. Order Value"
            description="voucher value requirement"
          />
        </Typography>
        <Typography>
          {voucher ? (
            channel?.minSpent ? (
              <Money money={channel.minSpent} />
            ) : (
              "-"
            )
          ) : (
            <Skeleton />
          )}
        </Typography>
        <FormSpacer />

        <Typography variant="caption">
          <FormattedMessage
            id="HLqWXA"
            defaultMessage="Usage Limit"
            description="voucher value requirement"
          />
        </Typography>
        <Typography>
          {maybe<React.ReactNode>(
            () => (voucher.usageLimit === null ? "-" : voucher.usageLimit),
            <Skeleton />,
          )}
        </Typography>
      </CardContent>
    </Card>
  );
};
VoucherSummary.displayName = "VoucherSummary";
export default VoucherSummary;
