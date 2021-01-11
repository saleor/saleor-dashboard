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
  data: Record<"price" | "costPrice", string>;
  errors: ProductErrorFragment[];
  loading?: boolean;
  onChange(event: any);
}

const ProductVariantPrice: React.FC<ProductVariantPriceProps> = props => {
  const { currencySymbol, data, errors, loading, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["price", "costPrice"], errors);

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
              hint={getProductErrorMessage(formErrors.price, intl)}
              name="price"
              label={intl.formatMessage({
                defaultMessage: "Price"
              })}
              value={data.price}
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
              error={!!formErrors.costPrice}
              name="costPrice"
              label={intl.formatMessage({
                defaultMessage: "Cost price"
              })}
              hint={
                getProductErrorMessage(formErrors.costPrice, intl) ||
                intl.formatMessage({
                  defaultMessage: "Optional",
                  description: "optional field",
                  id: "productVariantPriceOptionalCostPriceField"
                })
              }
              value={data.costPrice}
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
