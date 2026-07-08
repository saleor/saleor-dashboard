// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  type ChannelUsabilityDataQuery,
  type OrderDetailsFragment,
  type OrderErrorFragment,
  type OrderLineInput,
} from "@dashboard/graphql";
import { Box, Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderCardDatagridSeparator } from "../OrderCardTitle/OrderCardDatagridSeparator";
import { OrderCardTitle } from "../OrderCardTitle/OrderCardTitle";
import OrderDraftDetailsProducts from "../OrderDraftDetailsProducts/OrderDraftDetailsProducts";
import { alertMessages } from "../OrderDraftPage/messages";
import { OrderLineGroupEnd } from "../OrderLineGroupBottomSeparator/OrderLineGroupBottomSeparator";

interface OrderDraftDetailsProps {
  order: OrderDetailsFragment;
  channelUsabilityData?: ChannelUsabilityDataQuery;
  errors: OrderErrorFragment[];
  loading: boolean;
  orderLineRemoveConfirmState?: ConfirmButtonTransitionState;
  orderLineRemoveErrors?: OrderErrorFragment[];
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
  orderLineRemoveConfirmState,
  orderLineRemoveErrors,
  onOrderLineAdd,
  onOrderLineChange,
  onOrderLineRemove,
  onOrderLineShowMetadata,
}: OrderDraftDetailsProps) => {
  const intl = useIntl();
  const isChannelActive = order?.channel.isActive;
  const areProductsInChannel = !!channelUsabilityData?.products.totalCount;
  const canAddProducts = isChannelActive && areProductsInChannel;
  const hasLines = (order?.lines ?? []).length > 0;

  const getTooltip = () => {
    if (!isChannelActive) {
      return intl.formatMessage(alertMessages.inactiveChannel);
    }

    if (!areProductsInChannel) {
      return intl.formatMessage(alertMessages.noProductsInChannel);
    }

    return intl.formatMessage(
      {
        id: "empNV9",
        defaultMessage: "Add products from {channelName}",
        description: "add products button tooltip",
      },
      { channelName: order?.channel.name },
    );
  };

  return (
    <DashboardCard gap={0}>
      <OrderCardTitle
        status="draft"
        toolbar={
          <Box>
            <Button
              variant="secondary"
              onClick={onOrderLineAdd}
              disabled={!canAddProducts}
              title={getTooltip()}
              data-test-id="add-products-button"
            >
              <FormattedMessage id="C50ahv" defaultMessage="Add products" description="button" />
            </Button>
          </Box>
        }
      />
      {hasLines && <OrderCardDatagridSeparator />}
      <DashboardCard.Content {...(hasLines ? { paddingX: 0 } : { paddingBottom: 6 })}>
        <OrderDraftDetailsProducts
          order={order}
          errors={errors}
          loading={loading}
          orderLineRemoveConfirmState={orderLineRemoveConfirmState}
          orderLineRemoveErrors={orderLineRemoveErrors}
          onOrderLineChange={onOrderLineChange}
          onOrderLineRemove={onOrderLineRemove}
          onOrderLineShowMetadata={onOrderLineShowMetadata}
        />
        {hasLines && <OrderLineGroupEnd showBottomSeparator={false} backgroundColor="default1" />}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

OrderDraftDetails.displayName = "OrderDraftDetails";
export default OrderDraftDetails;
