import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";

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
  errors: UserError[];
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
              error={!!getFieldError(errors, "price_override")}
              name="priceOverride"
              label={intl.formatMessage({
                defaultMessage: "Selling price override"
              })}
              hint={
                getFieldError(errors, "price_override")?.message ||
                intl.formatMessage({
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
              error={!!getFieldError(errors, "cost_price")}
              name="costPrice"
              label={intl.formatMessage({
                defaultMessage: "Cost price override"
              })}
              hint={
                getFieldError(errors, "cost_price")?.message ||
                intl.formatMessage({
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
