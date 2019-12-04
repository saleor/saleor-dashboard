import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";

const useStyles = makeStyles(
  theme => ({
    grid: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  { name: "ProductVariantPrice" }
);

interface ProductVariantPriceProps {
  currencySymbol?: string;
  priceOverride?: string;
  costPrice?: string;
  errors: { [key: string]: string };
  loading?: boolean;
  onChange(event: any);
}

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const {
    currencySymbol,
    costPrice,
    errors,
    priceOverride,
    loading,
    onChange
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Pricing",
          description: "product pricing, section header"
        })}
      />
      <CardContent>
        <div className={classes.grid}>
          <div>
            <PriceField
              error={!!errors.price_override}
              name="priceOverride"
              label={intl.formatMessage({
                defaultMessage: "Selling price override"
              })}
              hint={
                errors.price_override
                  ? errors.price_override
                  : intl.formatMessage({
                      defaultMessage: "Optional",
                      description: "optional field",
                      id: "productVariantPriceOptionalPriceOverrideField"
                    })
              }
              value={priceOverride}
              currencySymbol={currencySymbol}
              onChange={onChange}
              disabled={loading}
            />
          </div>
          <div>
            <PriceField
              error={!!errors.cost_price}
              name="costPrice"
              label={intl.formatMessage({
                defaultMessage: "Cost price override"
              })}
              hint={
                errors.cost_price
                  ? errors.cost_price
                  : intl.formatMessage({
                      defaultMessage: "Optional",
                      description: "optional field",
                      id: "productVariantPriceOptionalCostPriceField"
                    })
              }
              value={costPrice}
              currencySymbol={currencySymbol}
              onChange={onChange}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
