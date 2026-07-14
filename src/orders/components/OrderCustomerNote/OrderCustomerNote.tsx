import { DashboardCard } from "@dashboard/components/Card";
import { Placeholder } from "@dashboard/components/Placeholder";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderCustomerNoteProps {
  note: string;
}

const OrderCustomerNote = ({ note }: OrderCustomerNoteProps) => {
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
          <Placeholder>
            <FormattedMessage id="VrFy8e" defaultMessage="No notes from customer" />
          </Placeholder>
        ) : (
          <Text>{note}</Text>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderCustomerNote;
