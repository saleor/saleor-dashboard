import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps
} from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { OrderDetails_order } from "../../types/OrderDetails";
import OrderDraftDetailsProducts, {
  FormData as OrderDraftDetailsProductsFormData
} from "../OrderDraftDetailsProducts";
import OrderDraftDetailsSummary from "../OrderDraftDetailsSummary";

interface OrderDraftDetailsProps {
  order: OrderDetails_order;
  onOrderLineAdd: () => void;
  onOrderLineChange: (
    id: string,
    data: OrderDraftDetailsProductsFormData
  ) => void;
  onOrderLineRemove: (id: string) => void;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  order,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onShippingMethodEdit
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Order Details",
          description: "section header"
        })}
        toolbar={
          order?.channel.isActive && (
            <Button
              color="primary"
              variant="text"
              onClick={onOrderLineAdd}
              data-test-id="add-products-button"
            >
              <FormattedMessage
                defaultMessage="Add products"
                description="button"
              />
            </Button>
          )
        }
      />
      <OrderDraftDetailsProducts
        lines={maybe(() => order.lines)}
        onOrderLineChange={onOrderLineChange}
        onOrderLineRemove={onOrderLineRemove}
      />
      {maybe(() => order.lines.length) !== 0 && (
        <CardContent>
          <OrderDiscountContext.Consumer>
            {(orderDiscountProps: OrderDiscountContextConsumerProps) => (
              <OrderDraftDetailsSummary
                order={order}
                onShippingMethodEdit={onShippingMethodEdit}
                {...orderDiscountProps}
              />
            )}
          </OrderDiscountContext.Consumer>
        </CardContent>
      )}
    </Card>
  );
};
OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
