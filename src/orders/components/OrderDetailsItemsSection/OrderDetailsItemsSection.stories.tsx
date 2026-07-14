import { WeightUnitsEnum } from "@dashboard/graphql";
import { listSettingsStorageKey } from "@dashboard/hooks/useListSettings";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import { ListViews } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { OrderDetailsItemsSection } from "./OrderDetailsItemsSection";

const order = OrderFixture.fulfilled().build();

const meta: Meta<typeof OrderDetailsItemsSection> = {
  title: "Orders/OrderDetailsItemsSection",
  component: OrderDetailsItemsSection,
  args: {
    order,
    shop: {
      __typename: "Shop" as const,
      fulfillmentAllowUnpaid: true,
      fulfillmentAutoApprove: true,
      defaultWeightUnit: WeightUnitsEnum.KG,
      countries: [],
      availablePaymentGateways: [],
    },
    loading: false,
    canFulfill: true,
    notAllowedToFulfillUnpaid: false,
    onOrderFulfill: fn(),
    onOrderReturn: fn(),
    onFulfillmentApprove: fn(),
    onFulfillmentCancel: fn(),
    onFulfillmentTrackingNumberUpdate: fn(),
    onOrderLineShowMetadata: fn(),
    onFulfillmentShowMetadata: fn(),
    onShowLinePriceBreakdown: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderDetailsItemsSection>;

export const Timeline: Story = {};

export const LineMatrix: Story = {
  decorators: [
    (StoryComponent: ComponentType) => {
      window.localStorage.setItem(
        listSettingsStorageKey,
        JSON.stringify({
          [ListViews.ORDER_DETAILS_LIST]: {
            rowNumber: 20,
            viewMode: "matrix",
          },
        }),
      );

      return <StoryComponent />;
    },
  ],
};
