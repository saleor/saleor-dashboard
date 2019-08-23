import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import { maybe } from "../../../misc";
import { ProductDetails_product } from "../../types/ProductDetails";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing.unit * 2 + "px",
      gridTemplateColumns: "1fr 1fr"
    }
  });

interface ProductStockProps extends WithStyles<typeof styles> {
  data: {
    sku: string;
    stockQuantity: number;
  };
  disabled: boolean;
  errors: { [key: string]: string };
  product: ProductDetails_product;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductStock = withStyles(styles, { name: "ProductStock" })(
  ({
    classes,
    data,
    disabled,
    product,
    onChange,
    errors
  }: ProductStockProps) => {
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
              error={!!errors.sku}
              helperText={errors.sku}
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
  }
);
ProductStock.displayName = "ProductStock";
export default ProductStock;
