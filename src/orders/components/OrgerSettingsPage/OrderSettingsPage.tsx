import Typography from "@material-ui/core/Typography";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderSettings from "../OrderSettings/OrderSettings";

export interface OrderSettingsForm {
  autoConfirmOrders: boolean;
}

export interface OrderSettingsPageProps {
  data: OrderSettingsForm;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: OrderSettingsForm) => void;
}

const formInitialData: OrderSettingsForm = {
  autoConfirmOrders: false
};

const OrderSettingsPage: React.FC<OrderSettingsPageProps> = props => {
  const { disabled, saveButtonBarState, onBack, onSubmit } = props;
  const intl = useIntl();

  return (
    <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.orders)}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Order settings",
              description: "header"
            })}
          />
          <Grid variant="inverted">
            <div>
              <Typography>
                <FormattedMessage defaultMessage="General Settings" />
              </Typography>
            </div>
            <OrderSettings data={data} disabled={disabled} onChange={change} />
          </Grid>
          <SaveButtonBar
            onCancel={onBack}
            onSave={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
OrderSettingsPage.displayName = "OrderSettingsPage";
export default OrderSettingsPage;
