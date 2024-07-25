// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import { Select } from "@dashboard/components/Select";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  shippingMethod: string;
}

export interface OrderShippingMethodEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  shippingMethod: string;
  shippingMethods?: OrderDetailsFragment["shippingMethods"];
  onClose: () => any;
  onSubmit?: (data: FormData) => any;
}

const OrderShippingMethodEditDialog: React.FC<OrderShippingMethodEditDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    shippingMethod,
    shippingMethods,
    onClose,
    onSubmit,
  } = props;
  const errors = useModalDialogErrors(apiErrors, open);
  const intl = useIntl();
  const formFields = ["shippingMethod"];
  const formErrors = getFormErrors(formFields, errors);
  const nonFieldErrors = errors.filter(err => !formFields.includes(err.field));
  const choices = shippingMethods
    ? shippingMethods
        .map(s => ({
          label: (
            <Box display="flex" width="100%" gap={3}>
              <Box as="span" __flex={1} overflow="hidden" textOverflow="ellipsis">
                {s.name}
              </Box>

              <Box>
                <Money money={s.price} />
              </Box>

              {!s.active && (
                <Text color="defaultDisabled" size={2} fontWeight="light">
                  {s.message}
                </Text>
              )}
            </Box>
          ),
          disabled: !s.active,
          value: s.id,
        }))
        .sort((x, y) => (x.disabled === y.disabled ? 0 : x.disabled ? 1 : -1))
    : [];
  const initialForm: FormData = {
    shippingMethod,
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data, submit }) => (
          <>
            <DashboardModal.Content __width={600}>
              <DashboardModal.Title>
                <FormattedMessage
                  id="V/YxJa"
                  defaultMessage="Edit Shipping Method"
                  description="dialog header"
                />
              </DashboardModal.Title>

              <Select
                options={choices as unknown as Option[]}
                error={!!formErrors.shippingMethod}
                helperText={getOrderErrorMessage(formErrors.shippingMethod, intl)}
                name="shippingMethod"
                data-test-id="shipping-method-select"
                value={data.shippingMethod}
                onChange={({ target }) => {
                  const value = target.value;
                  const isDisabled = choices.find(({ value }) => value === value)?.disabled;

                  if (isDisabled) {
                    return;
                  }

                  change({
                    target: {
                      name: "shippingMethod",
                      value: typeof value === "string" ? value : (value as Option)?.value,
                    },
                  });
                }}
              />
              {nonFieldErrors.length > 0 && (
                <>
                  <FormSpacer />
                  {nonFieldErrors.map((err, index) => (
                    <Text color="critical1" key={index}>
                      {getOrderErrorMessage(err, intl)}
                    </Text>
                  ))}
                </>
              )}

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  data-test-id="confirm-button"
                  transitionState={confirmButtonState}
                  onClick={submit}
                  disabled={!data.shippingMethod}
                >
                  <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          </>
        )}
      </Form>
    </DashboardModal>
  );
};

OrderShippingMethodEditDialog.displayName = "OrderShippingMethodEditDialog";
export default OrderShippingMethodEditDialog;
