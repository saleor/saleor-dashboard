// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import Money from "@dashboard/components/Money";
import { Select } from "@dashboard/components/Select";
import { type OrderDetailsFragment, type OrderErrorFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { Box, type Option, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { orderShippingMethodEditDialogMessages } from "./messages";

interface FormData {
  shippingMethod: string;
}

interface OrderShippingMethodEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  shippingMethod: string | null | undefined;
  shippingMethodName?: string;
  shippingPrice?: OrderDetailsFragment["shippingPrice"];
  shippingMethods?: OrderDetailsFragment["shippingMethods"];
  onClose: () => any;
  onSubmit?: (data: { shippingMethod: string | null }) => any;
  isClearable?: boolean;
}

const NO_SHIPPING_METHOD_ID = "no-shipping-method-selection";

const OrderShippingMethodEditDialog = (props: OrderShippingMethodEditDialogProps) => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    shippingMethod,
    shippingMethodName,
    shippingPrice,
    shippingMethods,
    onClose,
    onSubmit,
    isClearable = false,
  } = props;
  const errors = useModalDialogErrors(apiErrors, open);
  const intl = useIntl();
  const formFields = ["shippingMethod"];
  const formErrors = getFormErrors(formFields, errors);
  const nonFieldErrors = errors.filter(err => !formFields.includes(err.field));
  const noShippingMethodLabel = intl.formatMessage(
    orderShippingMethodEditDialogMessages.noShippingMethod,
  );
  const unavailableMethodLabel = intl.formatMessage(
    orderShippingMethodEditDialogMessages.currentMethod,
  );
  const notAvailableLabel = intl.formatMessage(orderShippingMethodEditDialogMessages.notAvailable);

  const availableChoices: Option[] = shippingMethods
    ? shippingMethods
        .map(s => ({
          label: s.name,
          disabled: !s.active,
          value: s.id,
          endAdornment: (
            <Box display="flex" alignItems="center" gap={3}>
              <Money money={s.price} />
              {!s.active && s.message && (
                <Text color="defaultDisabled" size={2} fontWeight="light">
                  {s.message}
                </Text>
              )}
            </Box>
          ),
        }))
        .sort((x, y) => (x.disabled === y.disabled ? 0 : x.disabled ? 1 : -1))
    : [];

  const currentMethodInChoices = availableChoices.some(c => c.value === shippingMethod);

  const unavailableMethodOption: Option[] =
    shippingMethod && !currentMethodInChoices
      ? [
          {
            label: shippingMethodName || unavailableMethodLabel,
            disabled: true,
            value: shippingMethod,
            endAdornment: (
              <Box display="flex" alignItems="center" gap={3}>
                {shippingPrice && (
                  <Text color="defaultDisabled">
                    <Money money={shippingPrice.gross} />
                  </Text>
                )}
                <Text color="defaultDisabled" size={2} fontWeight="light">
                  {notAvailableLabel}
                </Text>
              </Box>
            ),
          },
        ]
      : [];

  const noShippingOption: Option = {
    label: noShippingMethodLabel,
    value: NO_SHIPPING_METHOD_ID,
    disabled: false,
  };

  const choices: Option[] = [
    ...(isClearable ? [noShippingOption] : []),
    ...unavailableMethodOption,
    ...availableChoices,
  ];

  const initialForm: FormData = {
    shippingMethod:
      currentMethodInChoices || unavailableMethodOption.length > 0
        ? (shippingMethod as string)
        : NO_SHIPPING_METHOD_ID,
  };

  const handleSubmit = (data: FormData) => {
    if (onSubmit) {
      onSubmit({
        shippingMethod: data.shippingMethod === NO_SHIPPING_METHOD_ID ? null : data.shippingMethod,
      });
    }
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open && (
        <Form
          key={shippingMethod || "new"}
          initial={initialForm}
          onSubmit={handleSubmit}
          mergeData={false}
        >
          {({ change, data, submit }) => {
            const selectedChoice = choices.find(choice => choice.value === data.shippingMethod);

            return (
              <>
                <DashboardModal.Content size="sm">
                  <DashboardModal.Header>
                    {intl.formatMessage(orderShippingMethodEditDialogMessages.title)}
                  </DashboardModal.Header>

                  <DashboardModal.Body>
                    <DashboardModal.Inset>
                      <Box display="flex" flexDirection="column" gap={4}>
                        <Select
                          width="100%"
                          options={choices}
                          endAdornment={() => selectedChoice?.endAdornment}
                          error={!!formErrors.shippingMethod}
                          helperText={getOrderErrorMessage(formErrors.shippingMethod, intl)}
                          name="shippingMethod"
                          data-test-id="shipping-method-select"
                          value={data.shippingMethod}
                          onChange={({ target }) => {
                            const targetValue = target.value;
                            const isDisabled = choices.find(
                              choice => choice.value === targetValue,
                            )?.disabled;

                            if (isDisabled) {
                              return;
                            }

                            change({
                              target: {
                                name: "shippingMethod",
                                value:
                                  typeof targetValue === "string"
                                    ? targetValue
                                    : (targetValue as Option)?.value,
                              },
                            });
                          }}
                        />
                        {nonFieldErrors.map((err, index) => (
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
                      data-test-id="confirm-button"
                      transitionState={confirmButtonState}
                      onClick={submit}
                      disabled={
                        data.shippingMethod === initialForm.shippingMethod ||
                        (!isClearable && data.shippingMethod === NO_SHIPPING_METHOD_ID)
                      }
                    >
                      <FormattedMessage {...buttonMessages.confirm} />
                    </ConfirmButton>
                  </DashboardModal.Actions>
                </DashboardModal.Content>
              </>
            );
          }}
        </Form>
      )}
    </DashboardModal>
  );
};

OrderShippingMethodEditDialog.displayName = "OrderShippingMethodEditDialog";
export default OrderShippingMethodEditDialog;
