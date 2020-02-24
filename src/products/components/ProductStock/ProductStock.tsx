import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { UserError } from "@saleor/types";
import { getFieldError } from "@saleor/utils/errors";
import { maybe } from "../../../misc";
import { ProductDetails_product } from "../../types/ProductDetails";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: "1fr 1fr"
    }
  }),
  { name: "ProductStock" }
);

interface ProductStockProps {
  data: {
    sku: string;
    stockQuantity: number;
  };
  disabled: boolean;
  errors: UserError[];
  product: ProductDetails_product;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductStock: React.FC<ProductStockProps> = props => {
  const { data, disabled, product, onChange, errors } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Inventory",
          description: "product stock, section header",
          id: "productStockHeader"
        })}
      />
      <CardContent>
        <div className={classes.root}>
          <TextField
            disabled={disabled}
            name="sku"
            label={intl.formatMessage({
              defaultMessage: "SKU (Stock Keeping Unit)"
            })}
            value={data.sku}
            onChange={onChange}
            error={!!getFieldError(errors, "sku")}
            helperText={getFieldError(errors, "sku")?.message}
          />
          <TextField
            disabled={disabled}
            name="stockQuantity"
            label={intl.formatMessage({
              defaultMessage: "Inventory",
              description: "product stock",
              id: "prodictStockInventoryLabel"
            })}
            value={data.stockQuantity}
            type="number"
            onChange={onChange}
            helperText={
              product
                ? intl.formatMessage(
                    {
                      defaultMessage: "Allocated: {quantity}",
                      description: "allocated product stock"
                    },
                    {
                      quantity: maybe(
                        () => product.variants[0].quantityAllocated
                      )
                    }
                  )
                : undefined
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
ProductStock.displayName = "ProductStock";
export default ProductStock;
