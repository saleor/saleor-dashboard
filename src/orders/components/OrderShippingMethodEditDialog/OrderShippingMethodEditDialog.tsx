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
import { FormattedMessage, useIntl } from "react-intl";

interface FormData {
  shippingMethod: string;
}

interface OrderShippingMethodEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  shippingMethod: string;
  shippingMethodName?: string;
  shippingPrice?: OrderDetailsFragment["shippingPrice"];
  shippingMethods?: OrderDetailsFragment["shippingMethods"];
  onClose: () => any;
  onSubmit?: (data: FormData) => any;
}

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
  } = props;
  const errors = useModalDialogErrors(apiErrors, open);
  const intl = useIntl();
  const formFields = ["shippingMethod"];
  const formErrors = getFormErrors(formFields, errors);
  const nonFieldErrors = errors.filter(err => !formFields.includes(err.field));
  const availableChoices = shippingMethods
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

  const currentMethodInChoices = availableChoices.some(c => c.value === shippingMethod);

  const unavailableMethodOption =
    shippingMethod && !currentMethodInChoices
      ? [
          {
            label: (
              <Box display="flex" width="100%" gap={3}>
                <Box as="span" __flex={1} overflow="hidden" textOverflow="ellipsis">
                  <Text as="span" color="defaultDisabled">
                    {shippingMethodName || (
                      <FormattedMessage
                        id="12K83x"
                        defaultMessage="Current method"
                        description="shipping method option when name unknown"
                      />
                    )}
                  </Text>
                </Box>

                {shippingPrice && (
                  <Box>
                    <Text color="defaultDisabled">
                      <Money money={shippingPrice.gross} />
                    </Text>
                  </Box>
                )}

                <Text color="defaultDisabled" size={2} fontWeight="light">
                  <FormattedMessage
                    id="X1NCdA"
                    defaultMessage="(not available)"
                    description="shipping method not available label"
                  />
                </Text>
              </Box>
            ),
            disabled: true,
            value: shippingMethod,
          },
        ]
      : [];

  const choices = [...unavailableMethodOption, ...availableChoices];

  const initialForm: FormData = {
    shippingMethod: currentMethodInChoices ? shippingMethod : "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open && (
        <Form key={shippingMethod} initial={initialForm} onSubmit={onSubmit} mergeData={false}>
          {({ change, data, submit }) => (
            <>
              <DashboardModal.Content size="sm">
                <DashboardModal.Header>
                  <FormattedMessage
                    id="V/YxJa"
                    defaultMessage="Edit Shipping Method"
                    description="dialog header"
                  />
                </DashboardModal.Header>

                <Select
                  options={choices as unknown as Option[]}
                  error={!!formErrors.shippingMethod}
                  helperText={getOrderErrorMessage(formErrors.shippingMethod, intl)}
                  name="shippingMethod"
                  data-test-id="shipping-method-select"
                  value={data.shippingMethod}
                  onChange={({ target }) => {
                    const newValue = target.value;
                    const isDisabled = choices.find(choice => choice.value === newValue)?.disabled;

                    if (isDisabled) {
                      return;
                    }

                    change({
                      target: {
                        name: "shippingMethod",
                        value:
                          typeof newValue === "string" ? newValue : (newValue as Option)?.value,
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
      )}
    </DashboardModal>
  );
};

OrderShippingMethodEditDialog.displayName = "OrderShippingMethodEditDialog";
export default OrderShippingMethodEditDialog;
