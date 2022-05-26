import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
  note: string;
}

export const OrderCustomerNote: React.FC<OrderCustomerNoteProps> = ({
  note,
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "puALFo",
          defaultMessage: "Notes",
          description: "notes about customer, header",
        })}
      />
      <CardContent>
        {note === undefined ? (
          <Skeleton />
        ) : note === "" ? (
          <Typography color="textSecondary">
            <FormattedMessage
              id="VrFy8e"
              defaultMessage="No notes from customer"
            />
          </Typography>
        ) : (
          <Typography>{note}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default OrderCustomerNote;
