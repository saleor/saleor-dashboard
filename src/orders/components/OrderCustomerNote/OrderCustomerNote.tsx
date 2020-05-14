import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
  note: string;
}

export const OrderCustomerNote: React.FC<OrderCustomerNoteProps> = ({
  note
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Notes",
          description: "notes about customer, header"
        })}
      />
      <CardContent>
        {note === undefined ? (
          <Skeleton />
        ) : note === "" ? (
          <Typography color="textSecondary">
            <FormattedMessage defaultMessage="No notes from customer" />
          </Typography>
        ) : (
          <Typography>{note}</Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default OrderCustomerNote;
