import { Card, CardContent } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
} from "@saleor/graphql";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps,
} from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import OrderDraftDetailsProducts from "../OrderDraftDetailsProducts";
import OrderDraftDetailsSummary from "../OrderDraftDetailsSummary";

interface OrderDraftDetailsProps {
  order: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  errors: OrderErrorFragment[];
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  onShippingMethodEdit: () => void;
}

const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  order,
  channelUsabilityData,
  errors,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onShippingMethodEdit,
}) => {
  const intl = useIntl();

  const isChannelActive = order?.channel.isActive;
  const areProductsInChannel = !!channelUsabilityData?.products.totalCount;

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "18wvf7",
          defaultMessage: "Order Details",
          description: "section header",
        })}
        toolbar={
          isChannelActive &&
          areProductsInChannel && (
            <Button
              variant="tertiary"
              onClick={onOrderLineAdd}
              data-test-id="add-products-button"
            >
              <FormattedMessage
                id="C50ahv"
                defaultMessage="Add products"
                description="button"
              />
            </Button>
          )
        }
      />
      <OrderDraftDetailsProducts
        order={order}
        errors={errors}
        onOrderLineChange={onOrderLineChange}
        onOrderLineRemove={onOrderLineRemove}
      />
      {maybe(() => order.lines.length) !== 0 && (
        <CardContent>
          <OrderDiscountContext.Consumer>
            {(orderDiscountProps: OrderDiscountContextConsumerProps) => (
              <OrderDraftDetailsSummary
                order={order}
                errors={errors}
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
