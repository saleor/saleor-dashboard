import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  trackingNumber: string;
}

export interface OrderFulfillmentTrackingDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  trackingNumber: string;
  onClose: () => any;
  onConfirm: (data: FormData) => any;
}

const OrderFulfillmentTrackingDialog: React.FC<OrderFulfillmentTrackingDialogProps> = ({
  confirmButtonState,
  errors: apiErrors,
  open,
  trackingNumber,
  onConfirm,
  onClose,
}) => {
  const intl = useIntl();
  const errors = useModalDialogErrors(apiErrors, open);
  const formFields = ["trackingNumber"];
  const formErrors = getFormErrors(formFields, errors);
  const initialData: FormData = {
    trackingNumber: trackingNumber || "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <Form initial={initialData} onSubmit={onConfirm}>
          {({ change, data, submit }) => (
            <DashboardModal.Grid>
              <DashboardModal.Header>
                <FormattedMessage
                  id="/BJQIq"
                  defaultMessage="Add Tracking Code"
                  description="dialog header"
                />
              </DashboardModal.Header>

              <TextField
                error={!!formErrors.trackingNumber}
                helperText={getOrderErrorMessage(formErrors.trackingNumber, intl)}
                label={intl.formatMessage({
                  id: "yT/GAp",
                  defaultMessage: "Tracking number",
                })}
                name="trackingNumber"
                onChange={change}
                value={data.trackingNumber}
                fullWidth
                data-test-id="tracking-number-input"
              />

              {errors.length > 0 && (
                <>
                  <FormSpacer />
                  {errors
                    .filter(err => err.field && !formFields.includes(err.field))
                    .map((err, index) => (
                      <Text display="block" color="critical1" key={index}>
                        {getOrderErrorMessage(err, intl)}
                      </Text>
                    ))}
                </>
              )}

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
            </DashboardModal.Grid>
          )}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

OrderFulfillmentTrackingDialog.displayName = "OrderFulfillmentTrackingDialog";
export default OrderFulfillmentTrackingDialog;
