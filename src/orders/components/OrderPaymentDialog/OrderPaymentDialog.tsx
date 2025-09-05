// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  amount: number;
}

export interface OrderPaymentDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  initial: number;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const OrderPaymentDialog = ({
  confirmButtonState,
  errors,
  open,
  initial,
  onClose,
  onSubmit,
}: OrderPaymentDialogProps) => {
  const intl = useIntl();
  const formFields = ["payment"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form
        initial={{
          amount: initial,
        }}
        onSubmit={onSubmit}
      >
        {({ data, change, submit }) => (
          <DashboardModal.Content size="sm">
            <DashboardModal.Header>
              {intl.formatMessage({
                id: "+PbHKD",
                defaultMessage: "Capture Payment",
                description: "dialog header",
              })}
            </DashboardModal.Header>

            <TextField
              error={!!formErrors.payment}
              fullWidth
              helperText={getOrderErrorMessage(formErrors.payment, intl)}
              label={intl.formatMessage({
                id: "OhdPS1",
                defaultMessage: "Amount",
                description: "amount of refunded money",
              })}
              name="amount"
              onChange={change}
              inputProps={{
                step: "0.01",
              }}
              type="number"
              value={data.amount}
            />

            {errors.length > 0 && (
              <>
                <FormSpacer />
                {errors
                  .filter(err => !formFields.includes(err.field))
                  .map((err, index) => (
                    <Text color="critical1" key={index}>
                      {getOrderErrorMessage(err, intl)}
                    </Text>
                  ))}
              </>
            )}

            <DashboardModal.Actions>
              <BackButton onClick={onClose} />
              <ConfirmButton transitionState={confirmButtonState} onClick={submit}>
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Content>
        )}
      </Form>
    </DashboardModal>
  );
};

OrderPaymentDialog.displayName = "OrderPaymentDialog";
export default OrderPaymentDialog;
