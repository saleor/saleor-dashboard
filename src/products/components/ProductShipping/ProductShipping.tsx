// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ProductErrorFragment } from "@dashboard/graphql";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import createNonNegativeValueChangeHandler from "@dashboard/utils/handlers/nonNegativeValueChangeHandler";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
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

export const ProductShipping = (props: ProductShippingProps) => {
  const { data, disabled, errors, weightUnit, onChange } = props;
  const intl = useIntl();
  const formErrors = getFormErrors(["weight"], errors);
  const handleChange = createNonNegativeValueChangeHandler(onChange);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "3rIMq/",
            defaultMessage: "Shipping",
            description: "product shipping",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box __width="25%">
          <Input
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
            size="small"
            value={data.weight}
            onChange={handleChange}
            endAdornment={<Text marginRight={2}>{weightUnit || ""}</Text>}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
