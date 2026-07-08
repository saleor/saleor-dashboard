import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { orderFulfillmentApproveDialogMessages as messages } from "./messages";

interface OrderFulfillmentApproveDialogFormData {
  notifyCustomer: boolean;
}

interface OrderFulfillmentApproveDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: OrderFulfillmentApproveDialogFormData) => void;
}

const INITIAL_FORM_DATA: OrderFulfillmentApproveDialogFormData = {
  notifyCustomer: true,
};

export const OrderFulfillmentApproveDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  onConfirm,
  onClose,
}: OrderFulfillmentApproveDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const [formKey, setFormKey] = useState(0);

  useModalDialogOpen(open, {
    onOpen: () => setFormKey(current => current + 1),
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form key={formKey} initial={INITIAL_FORM_DATA} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <DashboardModal.Content size="xs">
            <DashboardModal.Header subtitle={<FormattedMessage {...messages.description} />}>
              <FormattedMessage {...messages.title} />
            </DashboardModal.Header>

            <DashboardModal.Body>
              <DashboardModal.Inset>
                <Box display="flex" flexDirection="column" gap={4}>
                  <ControlledCheckbox
                    testId="notify-customer"
                    name="notifyCustomer"
                    label={intl.formatMessage(messages.notifyCustomer)}
                    checked={data.notifyCustomer}
                    onChange={change}
                  />

                  {errors.map((err, index) => (
                    <Text display="block" color="critical1" key={index}>
                      {getOrderErrorMessage(err, intl)}
                    </Text>
                  ))}
                </Box>
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="submit"
                transitionState={confirmButtonState}
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.approve} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

OrderFulfillmentApproveDialog.displayName = "OrderFulfillmentApproveDialog";
