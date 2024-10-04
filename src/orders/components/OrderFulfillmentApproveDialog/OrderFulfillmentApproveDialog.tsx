import { Button } from "@dashboard/components/Button";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface OrderFulfillmentAcceptDialogFormData {
  notifyCustomer: boolean;
}

export interface OrderFulfillmentAcceptDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: OrderFulfillmentAcceptDialogFormData) => void;
}

const OrderFulfillmentApproveDialog: React.FC<OrderFulfillmentAcceptDialogProps> = props => {
  const { confirmButtonState, errors, open, onConfirm, onClose } = props;
  const intl = useIntl();

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <Form initial={{ notifyCustomer: true }} onSubmit={onConfirm}>
          {({ change, data, submit }) => (
            <DashboardModal.Grid>
              <DashboardModal.Header>
                <FormattedMessage {...messages.title} />
              </DashboardModal.Header>

              <Text>
                <FormattedMessage {...messages.description} />
              </Text>

              <Box>
                <ControlledCheckbox
                  data-test-id="notify-customer"
                  name={"notifyCustomer" as keyof OrderFulfillmentAcceptDialogFormData}
                  label={intl.formatMessage(messages.notifyCustomer)}
                  checked={data.notifyCustomer}
                  onChange={change}
                />

                {errors.length > 0 && (
                  <>
                    <FormSpacer />
                    {errors.map((err, index) => (
                      <Text display="block" color="critical1" key={index}>
                        {getOrderErrorMessage(err, intl)}
                      </Text>
                    ))}
                  </>
                )}
              </Box>

              <DashboardModal.Actions>
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.cancel} />
                </Button>
                <ConfirmButton
                  data-test-id="submit"
                  transitionState={confirmButtonState}
                  onClick={submit}
                >
                  <FormattedMessage {...buttonMessages.approve} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderFulfillmentApproveDialog.displayName = "OrderFulfillmentApproveDialog";
export default OrderFulfillmentApproveDialog;
