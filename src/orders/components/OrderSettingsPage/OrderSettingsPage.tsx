import { Backlink } from "@dashboard/components/Backlink";
import Container from "@dashboard/components/Container";
import Grid from "@dashboard/components/Grid";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import {
  OrderSettingsFragment,
  ShopOrderSettingsFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { orderListUrl } from "@dashboard/orders/urls";
import { Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
        <Container>
          <Backlink href={orderListUrl()}>
            {intl.formatMessage(sectionNames.orders)}
          </Backlink>
          <PageHeader
            title={intl.formatMessage({
              id: "Vu9nol",
              defaultMessage: "Order settings",
              description: "header",
            })}
            underline={true}
          />
          <Grid variant="inverted">
            <div>
              <Typography>
                <FormattedMessage
                  id="yuiyES"
                  defaultMessage="General Settings"
                />
              </Typography>
            </div>
            <OrderSettings data={data} disabled={disabled} onChange={change} />
            <div />
            <OrderFulfillmentSettings
              data={data}
              disabled={disabled}
              onChange={change}
            />
          </Grid>
          <Savebar
            onCancel={() => navigate(orderListUrl())}
            onSubmit={submit}
            disabled={isSaveDisabled}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </OrderSettingsForm>
  );
};
OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
