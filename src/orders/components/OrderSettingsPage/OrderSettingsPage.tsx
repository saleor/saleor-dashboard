import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  OrderSettingsFragment,
  ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderListUrl } from "@dashboard/orders/urls";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import OrderFulfillmentSettings from "../OrderFulfillmentSettings";
import OrderSettings from "../OrderSettings/OrderSettings";
import OrderSettingsForm from "./form";
import { OrderSettingsFormData } from "./types";

export interface OrderSettingsPageProps {
  orderSettings: OrderSettingsFragment;
  shop: ShopOrderSettingsFragment;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const OrderSettingsPage: React.FC<OrderSettingsPageProps> = props => {
  const { orderSettings, shop, disabled, saveButtonBarState, onSubmit } = props;
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <OrderSettingsForm
      orderSettings={orderSettings}
      shop={shop}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, submit, change, isSaveDisabled }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav
            href={orderListUrl()}
            title={intl.formatMessage({
              id: "Vu9nol",
              defaultMessage: "Order settings",
              description: "header",
            })}
          />
          <DetailPageLayout.Content>
            <Box margin="auto" height="100vh">
              <OrderSettings
                data={data}
                disabled={disabled}
                onChange={change}
              />
              <OrderFulfillmentSettings
                data={data}
                disabled={disabled}
                onChange={change}
              />
            </Box>
          </DetailPageLayout.Content>
          <Savebar
            onCancel={() => navigate(orderListUrl())}
            onSubmit={submit}
            disabled={isSaveDisabled}
            state={saveButtonBarState}
          />
        </DetailPageLayout>
      )}
    </OrderSettingsForm>
  );
};
OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
