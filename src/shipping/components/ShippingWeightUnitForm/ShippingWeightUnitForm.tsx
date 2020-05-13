import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardTitle from "@saleor/components/CardTitle";
import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import SingleSelectField from "@saleor/components/SingleSelectField";
import { buttonMessages, sectionNames } from "@saleor/intl";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { WeightUnitsEnum } from "../../../types/globalTypes";

export interface FormData {
  unit: WeightUnitsEnum;
}

export interface ShippingWeightUnitFormProps {
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  onSubmit: (unit: WeightUnitsEnum) => void;
}

const ShippingWeightUnitForm: React.FC<ShippingWeightUnitFormProps> = ({
  defaultWeightUnit,
  disabled,
  onSubmit
}) => {
  const intl = useIntl();
  const initialForm: FormData = {
    unit: defaultWeightUnit
  };
  return (
    <Form initial={initialForm} onSubmit={formData => onSubmit(formData.unit)}>
      {({ change, data, submit }) => (
        <Card>
          <CardTitle title={intl.formatMessage(sectionNames.configuration)} />
          <CardContent>
            <SingleSelectField
              disabled={disabled}
              choices={Object.keys(WeightUnitsEnum).map(unit => ({
                label: WeightUnitsEnum[unit],
                value: WeightUnitsEnum[unit]
              }))}
              label={intl.formatMessage({
                defaultMessage: "Shipping Weight Unit"
              })}
              hint={intl.formatMessage({
                defaultMessage:
                  "This unit will be used as default shipping weight"
              })}
              name={"unit" as keyof FormData}
              value={data.unit}
              onChange={change}
            />
          </CardContent>
          <Hr />
          <CardActions>
            <Button color="primary" onClick={submit}>
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
