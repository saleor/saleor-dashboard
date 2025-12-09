// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import {
  ChannelUsabilityDataQuery,
  OrderDetailsFragment,
  OrderErrorFragment,
  OrderLineInput,
} from "@dashboard/graphql";
import { Box, Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
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
  const isChannelActive = order?.channel.isActive;
  const areProductsInChannel = !!channelUsabilityData?.products.totalCount;

  return (
    <DashboardCard gap={0}>
      <OrderCardTitle
        status="draft"
        toolbar={
          isChannelActive &&
          areProductsInChannel && (
            <Box>
              <Button
                variant="secondary"
                onClick={onOrderLineAdd}
                data-test-id="add-products-button"
              >
                <FormattedMessage id="C50ahv" defaultMessage="Add products" description="button" />
              </Button>
            </Box>
          )
        }
      />
      <DashboardCard.Content paddingX={0}>
        <OrderDraftDetailsProducts
          order={order}
          errors={errors}
          loading={loading}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onOrderLineShowMetadata={onOrderLineShowMetadata}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
