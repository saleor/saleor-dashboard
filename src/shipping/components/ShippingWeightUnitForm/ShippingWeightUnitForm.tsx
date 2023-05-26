import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
import Form from "@dashboard/components/Form";
import SingleSelectField from "@dashboard/components/SingleSelectField";
import { WeightUnitsEnum } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { Card, CardActions, CardContent } from "@material-ui/core";
import { vars } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  unit: WeightUnitsEnum;
}

export interface ShippingWeightUnitFormProps {
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  onSubmit: (unit: WeightUnitsEnum) => SubmitPromise;
}

const ShippingWeightUnitForm: React.FC<ShippingWeightUnitFormProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit,
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    unit: defaultWeightUnit,
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={formData => onSubmit(formData.unit)}
    >
      {({ change, data, submit }) => (
        <Card>
          <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
          <CardContent>
            <SingleSelectField
              disabled={disabled}
              choices={Object.keys(WeightUnitsEnum).map(unit => ({
                label: WeightUnitsEnum[unit],
                value: WeightUnitsEnum[unit],
              }))}
              label={intl.formatMessage({
                id: "Rp/Okl",
                defaultMessage: "Shipping Weight Unit",
              })}
              hint={intl.formatMessage({
                id: "4Kq3O6",
                defaultMessage:
                  "This unit will be used as default shipping weight",
              })}
              name={"unit" as keyof FormData}
              value={data.unit}
              onChange={change}
            />
          </CardContent>
          <CardActions style={{ paddingLeft: vars.spacing[6] }}>
            <Button onClick={submit} data-test-id="save-unit">
              <FormattedMessage {...buttonMessages.save} />
            </Button>
          </CardActions>
        </Card>
      )}
    </Form>
  );
};
ShippingWeightUnitForm.displayName = "ShippingWeightUnitForm";
export default ShippingWeightUnitForm;
