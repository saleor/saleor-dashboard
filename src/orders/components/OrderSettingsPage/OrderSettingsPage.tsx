import { Typography } from "@material-ui/core";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { OrderSettingsFragment } from "@saleor/fragments/types/OrderSettingsFragment";
import { ShopOrderSettingsFragment } from "@saleor/fragments/types/ShopOrderSettingsFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Backlink } from "@saleor/macaw-ui";
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
  onBack: () => void;
  onSubmit: (data: OrderSettingsFormData) => SubmitPromise;
}

const OrderSettingsPage: React.FC<OrderSettingsPageProps> = props => {
  const {
    orderSettings,
    shop,
    disabled,
    saveButtonBarState,
    onBack,
    onSubmit
  } = props;
  const intl = useIntl();

  return (
    <OrderSettingsForm
      orderSettings={orderSettings}
      shop={shop}
      onSubmit={onSubmit}
    >
      {({ data, submit, hasChanged, change }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.orders)}
          </Backlink>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Order settings",
              description: "header"
            })}
            underline={true}
          />
          <Grid variant="inverted">
            <div>
              <Typography>
                <FormattedMessage defaultMessage="General Settings" />
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
            onCancel={onBack}
            onSubmit={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </OrderSettingsForm>
  );
};
OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
