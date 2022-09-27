import { Card, TableCell, TableRow } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import EventTime from "@saleor/components/EventTime";
import Money from "@saleor/components/Money";
import OverflowTooltip from "@saleor/components/OverflowTooltip";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { OrderDetailsFragment } from "@saleor/graphql";
import useLocale from "@saleor/hooks/useLocale";
import { buttonMessages } from "@saleor/intl";
import { Avatar, Pill } from "@saleor/macaw-ui";
import { getUserInitials, renderCollection } from "@saleor/misc";
import { getMoneyFormatted } from "@saleor/utils/intl";
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
              <FormattedMessage
                {...orderGrantedRefundsMessages.grantedRefunds}
              />
            </span>
            <div>
              {unsettled.amount > 0 && (
                <Pill
                  color="error"
                  label={intl.formatMessage(
                    orderGrantedRefundsMessages.unsettled,
                    {
                      currency: unsettled.currency,
                      money: getMoneyFormatted(locale, unsettled),
                    },
                  )}
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
            <TableCell className={classes.colReason}>
              {grantedRefund.reason}
            </TableCell>
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
              <Button>
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
