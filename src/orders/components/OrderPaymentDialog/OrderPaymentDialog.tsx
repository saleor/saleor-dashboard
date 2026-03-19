// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import { PriceField } from "@dashboard/components/PriceField";
import { OrderErrorFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Text } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface FormData {
  amount: number;
}

interface OrderPaymentDialogProps {
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
  const [amountInput, setAmountInput] = useState(initial.toString());

  useEffect(() => {
    if (open) {
      setAmountInput(initial.toString());
    }
  }, [initial, open]);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form
        initial={{
          amount: initial,
        }}
        onSubmit={onSubmit}
      >
        {({ change, submit }) => {
          return (
            <DashboardModal.Content size="sm">
              <DashboardModal.Header>
                {intl.formatMessage({
                  id: "+PbHKD",
                  defaultMessage: "Capture Payment",
                  description: "dialog header",
                })}
              </DashboardModal.Header>

              <PriceField
                error={!!formErrors.payment}
                hint={getOrderErrorMessage(formErrors.payment, intl)}
                label={intl.formatMessage({
                  id: "OhdPS1",
                  defaultMessage: "Amount",
                  description: "amount of refunded money",
                })}
                name="amount"
                value={amountInput}
                width="100%"
                onChange={event => {
                  const value = event.target.value ?? "";

                  setAmountInput(value);

                  if (!value) {
                    change({
                      target: {
                        name: "amount",
                        value: "",
                      },
                    });

                    return;
                  }

                  const parsed = parseFloat(value);

                  if (Number.isNaN(parsed)) {
                    return;
                  }

                  change({
                    target: {
                      name: "amount",
                      value: parsed,
                    },
                  });
                }}
                onBlur={() => {
                  const parsed = parseFloat(amountInput);

                  if (Number.isNaN(parsed)) {
                    change({
                      target: {
                        name: "amount",
                        value: "",
                      },
                    });
                    setAmountInput("");
                  } else {
                    change({
                      target: {
                        name: "amount",
                        value: parsed,
                      },
                    });
                    setAmountInput(parsed.toString());
                  }
                }}
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
          );
        }}
      </Form>
    </DashboardModal>
  );
};

OrderPaymentDialog.displayName = "OrderPaymentDialog";
export default OrderPaymentDialog;
