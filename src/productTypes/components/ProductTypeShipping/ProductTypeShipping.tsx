import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import { WeightUnitsEnum } from "../../../types/globalTypes";

interface ProductTypeShippingProps {
  data: {
    isShippingRequired: boolean;
    weight: number | null;
  };
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeShipping: React.StatelessComponent<
  ProductTypeShippingProps
> = ({ data, defaultWeightUnit, disabled, onChange }) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Shipping",
          description: "product type shipping settings, section header"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          checked={data.isShippingRequired}
          disabled={disabled}
          label={intl.formatMessage({
            defaultMessage: "Is this product shippable?",
            description: "switch button"
          })}
          name="isShippingRequired"
          onChange={onChange}
        />
        {data.isShippingRequired && (
          <TextField
            disabled={disabled}
            InputProps={{ endAdornment: defaultWeightUnit }}
            label={intl.formatMessage({
              defaultMessage: "Weight"
            })}
            name="weight"
            helperText={intl.formatMessage({
              defaultMessage:
                "Used to calculate rates for shipping for products of this product type, when specific weight is not given"
            })}
            type="number"
            value={data.weight}
            onChange={onChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

ProductTypeShipping.displayName = "ProductTypeShipping";
export default ProductTypeShipping;
