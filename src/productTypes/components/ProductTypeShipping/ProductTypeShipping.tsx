import { Card, CardContent, TextField } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";
import { useIntl } from "react-intl";

interface ProductTypeShippingProps {
  data: {
    isShippingRequired: boolean;
    weight: number | null;
  };
  weightUnit: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductTypeShipping: React.FC<ProductTypeShippingProps> = ({
  data,
  weightUnit,
  disabled,
  onChange,
}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "/2OOMe",
          defaultMessage: "Shipping",
          description: "product type shipping settings, section header",
        })}
      />
      <CardContent>
        <ControlledCheckbox
          checked={data.isShippingRequired}
          disabled={disabled}
          label={intl.formatMessage({
            id: "IBw72y",
            defaultMessage: "Is this product shippable?",
            description: "switch button",
          })}
          name="isShippingRequired"
          onChange={onChange}
        />
        {data.isShippingRequired && (
          <TextField
            disabled={disabled}
            InputProps={{ endAdornment: weightUnit }}
            label={intl.formatMessage({
              id: "zCb8fX",
              defaultMessage: "Weight",
            })}
            name="weight"
            helperText={intl.formatMessage({
              id: "VOiUXQ",
              defaultMessage:
                "Used to calculate rates for shipping for products of this product type, when specific weight is not given",
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
