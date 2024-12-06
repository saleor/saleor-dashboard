import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { TextField } from "@material-ui/core";
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

const ProductTypeShipping = ({
  data,
  weightUnit,
  disabled,
  onChange,
}: ProductTypeShippingProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "/2OOMe",
            defaultMessage: "Shipping",
            description: "product type shipping settings, section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ProductTypeShipping.displayName = "ProductTypeShipping";
export default ProductTypeShipping;
