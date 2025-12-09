// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
} from "@dashboard/graphql";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDraftDetailsProducts from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";

interface OrderDraftDetailsProps {
  order: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  errors: OrderErrorFragment[];
  loading: boolean;
  onOrderLineAdd: () => void;
  onOrderLineChange: (id: string, data: OrderLineInput) => void;
  onOrderLineRemove: (id: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
}

const OrderDraftDetails = ({
  order,
  channelUsabilityData,
  errors,
  loading,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onOrderLineShowMetadata,
}: OrderDraftDetailsProps) => {
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
            <Button variant="secondary" onClick={onOrderLineAdd} data-test-id="add-products-button">
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
        onOrderLineShowMetadata={onOrderLineShowMetadata}
      />
    </DashboardCard>
  );
};

OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
