import { Card } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { OrderDetailsFragment } from "@saleor/graphql";
import React from "react";

interface OrderPaymementProps {
  order: OrderDetailsFragment | undefined;
}

const OrderPayment: React.FC<OrderPaymementProps> = ({ order }) => (
  <Card>
    <CardTitle title={"Payment"} />
  </Card>
);

export default OrderPayment;
