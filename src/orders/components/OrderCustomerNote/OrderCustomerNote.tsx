import { DashboardCard } from "@dashboard/components/Card";
import Skeleton from "@dashboard/components/Skeleton";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
  note: string;
}

export const OrderCustomerNote: React.FC<OrderCustomerNoteProps> = ({ note }) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "puALFo",
          defaultMessage: "Notes",
          description: "notes about customer, header",
        })}
      />
      <DashboardCard.Content>
        {note === undefined ? (
          <Skeleton />
        ) : note === "" ? (
          <Typography color="textSecondary">
            <FormattedMessage id="VrFy8e" defaultMessage="No notes from customer" />
          </Typography>
        ) : (
          <Typography>{note}</Typography>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
export default OrderCustomerNote;
