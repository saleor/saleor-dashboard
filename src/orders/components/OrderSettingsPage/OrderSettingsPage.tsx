import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import Grid from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  OrderSettingsFragment,
  ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderListUrl } from "@dashboard/orders/urls";
import { Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
        <DetailPageLayout>
          <TopNav
            href={orderListUrl()}
            title={intl.formatMessage({
              id: "Vu9nol",
              defaultMessage: "Order settings",
              description: "header",
            })}
          />
          <DetailPageLayout.Content>
            <Box padding={9} margin="auto" height="100vh">
              <Grid variant="inverted">
                <div>
                  <Typography>
                    <FormattedMessage
                      id="yuiyES"
                      defaultMessage="General Settings"
                    />
                  </Typography>
                </div>
                <OrderSettings
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
                <div />
                <OrderFulfillmentSettings
                  data={data}
                  disabled={disabled}
                  onChange={change}
                />
              </Grid>
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
