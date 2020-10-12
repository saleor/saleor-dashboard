import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

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
  price?: string;
  costPrice?: string;
  errors: ProductErrorFragment[];
  loading?: boolean;
  onChange(event: any);
}

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const { currencySymbol, costPrice, errors, price, loading, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["price", "cost_price"], errors);

  const handlePriceChange = createNonNegativeValueChangeHandler(onChange);

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
              error={!!formErrors.price}
              name="price"
              label={intl.formatMessage({
                defaultMessage: "Price"
              })}
              value={price}
              currencySymbol={currencySymbol}
              onChange={handlePriceChange}
              disabled={loading}
              InputProps={{
                inputProps: {
                  min: "0"
                }
              }}
            />
          </div>
          <div>
            <PriceField
              error={!!formErrors.cost_price}
              name="costPrice"
              label={intl.formatMessage({
                defaultMessage: "Cost price"
              })}
              hint={
                getProductErrorMessage(formErrors.cost_price, intl) ||
                intl.formatMessage({
                  defaultMessage: "Optional",
                  description: "optional field",
                  id: "productVariantPriceOptionalCostPriceField"
                })
              }
              value={costPrice}
              currencySymbol={currencySymbol}
              onChange={handlePriceChange}
              disabled={loading}
              InputProps={{
                inputProps: {
                  min: "0"
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
ProductVariantPrice.displayName = "ProductVariantPrice";
export default ProductVariantPrice;
