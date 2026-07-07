import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { orderFulfillmentTrackingDialogMessages } from "./messages";

interface FormData {
  trackingNumber: string;
}

interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  trackingNumber: string;
  onClose: () => void;
  onConfirm: (data: FormData) => void;
}

export const OrderFulfillmentTrackingDialog = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  trackingNumber,
  onConfirm,
  onClose,
}: OrderFulfillmentTrackingDialogProps) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const formFields = ["trackingNumber"] as const;

  const isTrackingNumberField = (field: string | null): field is (typeof formFields)[number] =>
    field !== null && formFields.includes(field as (typeof formFields)[number]);
  const formErrors = getFormErrors([...formFields], errors);
  const initialData: FormData = {
    trackingNumber: trackingNumber || "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={initialData} onSubmit={onConfirm}>
        {({ change, data, submit }) => (
          <DashboardModal.Content size="xs">
            <DashboardModal.Header>
              <FormattedMessage {...orderFulfillmentTrackingDialogMessages.title} />
            </DashboardModal.Header>

            <DashboardModal.Body>
              <DashboardModal.Inset>
                <Box display="flex" flexDirection="column" gap={4}>
                  <TextField
                    error={!!formErrors.trackingNumber}
                    helperText={getOrderErrorMessage(formErrors.trackingNumber, intl)}
                    label={intl.formatMessage(
                      orderFulfillmentTrackingDialogMessages.trackingNumber,
                    )}
                    name="trackingNumber"
                    onChange={change}
                    value={data.trackingNumber}
                    fullWidth
                    data-test-id="tracking-number-input"
                  />

                  {errors
                    .filter(err => !isTrackingNumberField(err.field))
                    .map((err, index) => (
                      <Text
                        display="block"
                        color="critical1"
                        key={index}
                        data-test-id="dialog-error"
                      >
                        {getOrderErrorMessage(err, intl)}
                      </Text>
                    ))}
                </Box>
              </DashboardModal.Inset>
            </DashboardModal.Body>

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                data-test-id="confirm-tracking-number-button"
                transitionState={confirmButtonState}
                onClick={submit}
              >
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

OrderFulfillmentTrackingDialog.displayName = "OrderFulfillmentTrackingDialog";
