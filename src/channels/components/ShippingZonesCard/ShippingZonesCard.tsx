import { Card } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Shipping Zones",
    description: "card title"
  }
});

interface ShippingZonesCardProps {}

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = ({}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
    </Card>
  );
};

export default ShippingZonesCard;
