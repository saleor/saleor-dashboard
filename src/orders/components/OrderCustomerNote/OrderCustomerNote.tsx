import { DashboardCard } from "@dashboard/components/Card";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
  note: string;
}

export const OrderCustomerNote = ({ note }: OrderCustomerNoteProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "puALFo",
            defaultMessage: "Notes",
            description: "notes about customer, header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {note === undefined ? (
          <Skeleton />
        ) : note === "" ? (
          <Text color="default2">
            <FormattedMessage id="VrFy8e" defaultMessage="No notes from customer" />
          </Text>
        ) : (
          <Text>{note}</Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};
export default OrderCustomerNote;
