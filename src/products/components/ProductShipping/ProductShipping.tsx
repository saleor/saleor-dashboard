// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ProductErrorFragment } from "@dashboard/graphql";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { InputAdornment, TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

interface ProductShippingProps {
  data: {
    weight: string;
  };
  disabled: boolean;
  errors: ProductErrorFragment[];
  weightUnit: string;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const ProductShipping: React.FC<ProductShippingProps> = props => {
  const { data, disabled, errors, weightUnit, onChange } = props;

  const intl = useIntl();

  const formErrors = getFormErrors(["weight"], errors);
  const handleChange = createNonNegativeValueChangeHandler(onChange);

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "3rIMq/",
          defaultMessage: "Shipping",
          description: "product shipping",
        })}
      </DashboardCard.Title>
      <DashboardCard.Content>
        <TextField
          disabled={disabled}
          label={intl.formatMessage({
            id: "SUbxSK",
            defaultMessage: "Weight",
            description: "product weight",
          })}
          error={!!formErrors.weight}
          helperText={getProductErrorMessage(formErrors.weight, intl)}
          name="weight"
          type="number"
          value={data.weight}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{weightUnit || ""}</InputAdornment>
            ),
            inputProps: {
              min: 0,
            },
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
