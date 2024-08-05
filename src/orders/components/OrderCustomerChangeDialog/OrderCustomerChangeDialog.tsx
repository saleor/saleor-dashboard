import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderCustomerChangeForm, { CustomerChangeActionEnum, OrderCustomerChangeData } from "./form";
import messages from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerChangeDialogProps {
  open: boolean;
  onConfirm: (data: OrderCustomerChangeData) => void;
  onClose: () => any;
}

const OrderCustomerChangeDialog: React.FC<OrderCustomerChangeDialogProps> = props => {
  const { open, onClose, onConfirm } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content __width={DASHBOARD_MODAL_WIDTH}>
        <OrderCustomerChangeForm onSubmit={onConfirm}>
          {({ change, data }) => (
            <Box display="grid" gap={6}>
              <DashboardModal.Title>
                <FormattedMessage {...messages.title} />
              </DashboardModal.Title>
              <Text>
                <FormattedMessage {...messages.description} />
              </Text>
              <RadioGroup
                className={classes.container}
                value={data.changeActionOption}
                name="changeActionOption"
                onChange={event => change(event)}
              >
                <FormControlLabel
                  value={CustomerChangeActionEnum.KEEP_ADDRESS}
                  control={<Radio color="primary" />}
                  label={intl.formatMessage(messages.keepAddress)}
                  className={classes.optionLabel}
                />
                <FormControlLabel
                  value={CustomerChangeActionEnum.CHANGE_ADDRESS}
                  control={<Radio color="primary" />}
                  label={intl.formatMessage(messages.changeAddress)}
                  className={classes.optionLabel}
                />
              </RadioGroup>
              <DashboardModal.Actions>
                <ConfirmButton transitionState="default" type="submit">
                  <FormattedMessage {...buttonMessages.continue} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </Box>
          )}
        </OrderCustomerChangeForm>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderCustomerChangeDialog.displayName = "OrderCustomerChangeDialog";
export default OrderCustomerChangeDialog;
