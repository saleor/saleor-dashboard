import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import PriceField from "@saleor/components/PriceField";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "1fr 1fr"
    }
  });

interface ProductPricingProps extends WithStyles<typeof styles> {
  currency?: string;
  data: {
    chargeTaxes: boolean;
    basePrice: number;
  };
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductPricing = withStyles(styles, { name: "ProductPricing" })(
  ({ classes, currency, data, disabled, onChange }: ProductPricingProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Pricing",
            description: "product pricing"
          })}
        >
          <ControlledCheckbox
            name="chargeTaxes"
            label={intl.formatMessage({
              defaultMessage: "Charge taxes for this item"
            })}
            checked={data.chargeTaxes}
            onChange={onChange}
            disabled={disabled}
          />
        </CardTitle>
        <CardContent>
          <div className={classes.root}>
            <PriceField
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "Price",
                description: "product price"
              })}
              name="basePrice"
              value={data.basePrice}
              currencySymbol={currency}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
);
ProductPricing.displayName = "ProductPricing";
export default ProductPricing;
