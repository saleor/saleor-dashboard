// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import EventTime from "@dashboard/components/EventTime";
import Money, { formatMoney } from "@dashboard/components/Money";
import OverflowTooltip from "@dashboard/components/OverflowTooltip";
import { Pill } from "@dashboard/components/Pill";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import { OrderDetailsFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { buttonMessages } from "@dashboard/intl";
import { getUserInitials, renderCollection } from "@dashboard/misc";
import { orderGrantRefundEditUrl } from "@dashboard/orders/urls";
import { Card, TableCell, TableRow } from "@material-ui/core";
import { Avatar } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderGrantedRefundsMessages } from "./messages";
import { useStyles } from "./styles";

interface OrderGrantedRefundsProps {
  order: OrderDetailsFragment;
}

const OrderGrantedRefunds: React.FC<OrderGrantedRefundsProps> = ({ order }) => {
  const classes = useStyles();
  const intl = useIntl();
  const { locale } = useLocale();

  if (!order || order?.grantedRefunds?.length === 0) {
    return null;
  }

  const unsettled = order.totalRemainingGrant;

  return (
    <Card>
      <CardTitle
        className={classes.cardTitleWrapper}
        title={
          <div className={classes.cardTitleContent}>
            <span>
              <FormattedMessage {...orderGrantedRefundsMessages.grantedRefunds} />
            </span>
            <div>
              {unsettled.amount > 0 && (
                <Pill
                  color="error"
                  label={intl.formatMessage(orderGrantedRefundsMessages.unsettled, {
                    money: formatMoney(unsettled, locale),
                  })}
                />
              )}
            </div>
          </div>
        }
      ></CardTitle>
      <ResponsiveTable className={classes.table}>
        {renderCollection(order?.grantedRefunds, grantedRefund => (
          <TableRow>
            <TableCell className={classes.colMoney}>
              <Money money={grantedRefund.amount} />
            </TableCell>
            <TableCell className={classes.colReason}>{grantedRefund.reason}</TableCell>
            <TableCell>
              <EventTime date={grantedRefund.createdAt} />
            </TableCell>
            <TableCell className={classes.colRequester}>
              {grantedRefund.app ? (
                grantedRefund.app.name
              ) : grantedRefund.user ? (
                <div className={classes.avatarContainer}>
                  <Avatar
                    avatar={grantedRefund.user.avatar?.url}
                    initials={getUserInitials(grantedRefund.user)}
                  />
                  <OverflowTooltip>{grantedRefund.user.email}</OverflowTooltip>
                </div>
              ) : null}
            </TableCell>
            <TableCell className={classes.colAction}>
              <Button href={orderGrantRefundEditUrl(order.id, grantedRefund.id)}>
                <FormattedMessage {...buttonMessages.edit} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </ResponsiveTable>
    </Card>
  );
};

export default OrderGrantedRefunds;
