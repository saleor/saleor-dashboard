import Form from "@dashboard/components/Form";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Combobox, Option, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  unit: Option | null;
}

export interface ShippingWeightUnitFormProps {
  defaultWeightUnit: WeightUnitsEnum | null;
  disabled: boolean;
  onSubmit: (unit: WeightUnitsEnum | null) => SubmitPromise;
}

const ShippingWeightUnitForm: React.FC<ShippingWeightUnitFormProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    unit: defaultWeightUnit
      ? {
          label: defaultWeightUnit,
          value: defaultWeightUnit,
        }
      : null,
  };
  const unitValues: string[] = React.useMemo(
    () => Object.values(WeightUnitsEnum),
    [WeightUnitsEnum],
  );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={formData => onSubmit(formData.unit?.value as WeightUnitsEnum)}
    >
      {({ change, data, submit }) => {
        const hasIncorrectUnit = !unitValues.includes(data.unit?.value ?? "");
        return (
          <Box display="flex" gap={4} flexDirection="column" marginTop={4}>
            <Box>
              <Text variant="caption" marginBottom={4}>
                {intl.formatMessage({
                  id: "4Kq3O6",
                  defaultMessage:
                    "This unit will be used as default shipping weight",
                })}
              </Text>
              <Combobox
                disabled={disabled}
                options={unitValues.map(unit => ({
                  label: unit,
                  value: unit,
                }))}
                label={intl.formatMessage({
                  id: "Rp/Okl",
                  defaultMessage: "Shipping Weight Unit",
                })}
                name={"unit" as keyof FormData}
                value={data.unit}
                onChange={value => change({ target: { name: "unit", value } })}
              />
            </Box>
            <Button
              variant="primary"
              onClick={submit}
              disabled={disabled || hasIncorrectUnit}
              data-test-id="save-unit"
              alignSelf="end"
            >
              <FormattedMessage {...buttonMessages.save} />
            </Button>
          </Box>
        );
      }}
    </Form>
  );
};
ShippingWeightUnitForm.displayName = "ShippingWeightUnitForm";
export default ShippingWeightUnitForm;
