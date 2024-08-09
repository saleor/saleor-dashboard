// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
} from "@dashboard/graphql";
import {
  OrderDiscountContext,
  OrderDiscountContextConsumerProps,
} from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import OrderDraftDetailsProducts from "../OrderDraftDetailsProducts";
import OrderDraftDetailsSummary from "../OrderDraftDetailsSummary";

interface OrderDraftDetailsProps {
  order: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  errors: OrderErrorFragment[];
  loading: boolean;
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  onShippingMethodEdit: () => void;
  onShowMetadata: (id: string) => void;
}

const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  order,
  channelUsabilityData,
  errors,
  loading,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onShippingMethodEdit,
  onShowMetadata,
}) => {
  const intl = useIntl();
  const isChannelActive = order?.channel.isActive;
  const areProductsInChannel = !!channelUsabilityData?.products.totalCount;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "18wvf7",
            defaultMessage: "Order Details",
            description: "section header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          {isChannelActive && areProductsInChannel && (
            <Button variant="tertiary" onClick={onOrderLineAdd} data-test-id="add-products-button">
              <FormattedMessage id="C50ahv" defaultMessage="Add products" description="button" />
            </Button>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <OrderDraftDetailsProducts
        order={order}
        errors={errors}
        loading={loading}
        onOrderLineChange={onOrderLineChange}
        onOrderLineRemove={onOrderLineRemove}
        onShowMetadata={onShowMetadata}
      />
      {maybe(() => order.lines.length) !== 0 && (
        <DashboardCard.Content>
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
        </DashboardCard.Content>
      )}
    </DashboardCard>
  );
};

OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
