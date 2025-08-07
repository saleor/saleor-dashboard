import Form from "@dashboard/components/Form";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Option, Select } from "@saleor/macaw-ui-next";
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

const ShippingWeightUnitForm = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
}: ShippingWeightUnitFormProps) => {
  const intl = useIntl();
  const initialForm: FormData = {
    unit: defaultWeightUnit
      ? {
          label: defaultWeightUnit,
          value: defaultWeightUnit,
        }
      : null,
  };
  const unitOptions: Option[] = React.useMemo(
    () =>
      Object.values(WeightUnitsEnum).map(unit => ({
        label: unit,
        value: unit,
      })),
    [WeightUnitsEnum],
  );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={formData => {
        return formData.unit ? onSubmit(formData.unit.value as WeightUnitsEnum) : undefined;
      }}
    >
      {({ change, data, submit }) => {
        return (
          <Box display="flex" gap={4} flexDirection="column" marginTop={4}>
            <Box>
              <Select
                disabled={disabled}
                options={unitOptions}
                label={intl.formatMessage({
                  id: "Rp/Okl",
                  defaultMessage: "Shipping Weight Unit",
                })}
                name={"unit" satisfies keyof FormData}
                value={data.unit}
                onChange={value => change({ target: { name: "unit", value } })}
                helperText={intl.formatMessage({
                  id: "4Kq3O6",
                  defaultMessage: "This unit will be used as default shipping weight",
                })}
              />
            </Box>
            <Button
              variant="primary"
              onClick={submit}
              disabled={disabled || !data.unit}
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
