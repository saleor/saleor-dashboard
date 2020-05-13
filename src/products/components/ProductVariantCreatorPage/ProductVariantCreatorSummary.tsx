import Card from "@material-ui/core/Card";
import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import purple from "@material-ui/core/colors/purple";
import yellow from "@material-ui/core/colors/yellow";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import Hr from "@saleor/components/Hr";
import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductVariantBulkCreateInput } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import { getBulkProductErrorMessage } from "@saleor/utils/errors/product";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductDetails_product_productType_variantAttributes } from "../../types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";
import { VariantField } from "./reducer";

export interface ProductVariantCreatorSummaryProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  warehouses: WarehouseFragment[];
  onVariantDataChange: (
    variantIndex: number,
    field: VariantField,
    value: string
  ) => void;
  onVariantStockDataChange: (
    variantIndex: number,
    warehouseId: string,
    value: string
  ) => void;
  onVariantDelete: (variantIndex: number) => void;
}
type ClassKey =
  | "attributeValue"
  | "card"
  | "col"
  | "colHeader"
  | "colName"
  | "colPrice"
  | "colSku"
  | "colStock"
  | "delete"
  | "hr"
  | "input"
  | "summary";

const colors = [blue, cyan, green, purple, yellow].map(color => color[800]);

const useStyles = makeStyles<
  Theme,
  ProductVariantCreatorSummaryProps,
  ClassKey
>(
  theme => ({
    attributeValue: {
      display: "inline-block",
      marginRight: theme.spacing(1)
    },
    card: {
      paddingBottom: theme.spacing()
    },
    col: {
      ...theme.typography.body1,
      fontSize: 14
    },
    colHeader: {
      ...theme.typography.body1,
      fontSize: 14,
      paddingTop: theme.spacing(3)
    },
    colName: {
      "&:not($colHeader)": {
        paddingTop: theme.spacing(2)
      },
      paddingLeft: theme.spacing(3)
    },
    colPrice: {},
    colSku: {},
    colStock: {},
    delete: {
      marginTop: theme.spacing(0.5)
    },
    hr: {
      gridColumn: props => `span ${4 + props.data.variants[0].stocks.length}`
    },
    input: {
      "& input": {
        padding: "16px 12px 17px"
      }
    },
    summary: {
      columnGap: theme.spacing(3),
      display: "grid",
      gridTemplateColumns: props =>
        `minmax(240px, auto) 170px repeat(${props.data.variants[0].stocks.length}, 140px) 140px 64px`,
      overflowX: "scroll",
      rowGap: theme.spacing() + "px"
    }
  }),
  {
    name: "ProductVariantCreatorSummary"
  }
);

function getVariantName(
  variant: ProductVariantBulkCreateInput,
  attributes: ProductDetails_product_productType_variantAttributes[]
): string[] {
  return attributes.reduce(
    (acc, attribute) => [
      ...acc,
      attribute.values.find(
        value =>
          value.slug ===
          variant.attributes.find(
            variantAttribute => variantAttribute.id === attribute.id
          ).values[0]
      ).name
    ],
    []
  );
}

const ProductVariantCreatorSummary: React.FC<ProductVariantCreatorSummaryProps> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    errors,
    warehouses,
    onVariantDataChange,
    onVariantDelete,
    onVariantStockDataChange
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Created Variants",
          description: "variant creator summary card header"
        })}
      />
      <div className={classes.summary}>
        <div
          className={classNames(
            classes.col,
            classes.colHeader,
            classes.colName
          )}
        >
          <FormattedMessage
            defaultMessage="Variant"
            description="variant name"
          />
        </div>
        <div
          className={classNames(
            classes.col,
            classes.colHeader,
            classes.colPrice
          )}
        >
          <FormattedMessage
            defaultMessage="Price"
            description="variant price"
          />
        </div>
        {data.warehouses.map(warehouseId => (
          <div
            className={classNames(
              classes.col,
              classes.colHeader,
              classes.colStock
            )}
            key={warehouseId}
          >
            {warehouses.find(warehouse => warehouse.id === warehouseId).name}
          </div>
        ))}
        <div
          className={classNames(classes.col, classes.colHeader, classes.colSku)}
        >
          <FormattedMessage defaultMessage="SKU" />
        </div>
        <div className={classNames(classes.col, classes.colHeader)} />
        <Hr className={classes.hr} />
        {data.variants.map((variant, variantIndex) => {
          const variantErrors = errors.filter(
            error => error.index === variantIndex
          );
          const variantFormErrors = getFormErrors(
            ["priceOverride", "quantity", "sku"],
            variantErrors
          );

          return (
            <React.Fragment
              key={variant.attributes
                .map(attribute => attribute.values[0])
                .join(":")}
            >
              <div className={classNames(classes.col, classes.colName)}>
                {getVariantName(variant, attributes).map(
                  (value, valueIndex) => (
                    <span
                      className={classes.attributeValue}
                      style={{
                        color: colors[valueIndex % colors.length]
                      }}
                      key={`${value}:${valueIndex}`}
                    >
                      {value}
                    </span>
                  )
                )}
              </div>
              <div className={classNames(classes.col, classes.colPrice)}>
                <TextField
                  InputProps={{
                    endAdornment: currencySymbol
                  }}
                  className={classes.input}
                  error={!!variantFormErrors.priceOverride}
                  helperText={getBulkProductErrorMessage(
                    variantFormErrors.priceOverride,
                    intl
                  )}
                  inputProps={{
                    min: 0,
                    type: "number"
                  }}
                  fullWidth
                  value={variant.priceOverride}
                  onChange={event =>
                    onVariantDataChange(
                      variantIndex,
                      "price",
                      event.target.value
                    )
                  }
                />
              </div>
              {variant.stocks.map(stock => (
                <div
                  className={classNames(classes.col, classes.colStock)}
                  key={stock.warehouse}
                >
                  <TextField
                    className={classes.input}
                    error={!!variantFormErrors.quantity}
                    helperText={getBulkProductErrorMessage(
                      variantFormErrors.quantity,
                      intl
                    )}
                    inputProps={{
                      min: 0,
                      type: "number"
                    }}
                    fullWidth
                    value={stock.quantity}
                    onChange={event =>
                      onVariantStockDataChange(
                        variantIndex,
                        stock.warehouse,
                        event.target.value
                      )
                    }
                  />
                </div>
              ))}
              <div className={classNames(classes.col, classes.colSku)}>
                <TextField
                  className={classes.input}
                  error={!!variantFormErrors.sku}
                  helperText={getBulkProductErrorMessage(
                    variantFormErrors.sku,
                    intl
                  )}
                  fullWidth
                  value={variant.sku}
                  onChange={event =>
                    onVariantDataChange(variantIndex, "sku", event.target.value)
                  }
                />
              </div>
              <div className={classes.col}>
                <IconButton
                  className={classes.delete}
                  color="primary"
                  onClick={() => onVariantDelete(variantIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              {variantIndex !== data.variants.length - 1 && (
                <Hr className={classes.hr} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

ProductVariantCreatorSummary.displayName = "ProductVariantCreatorSummary";
export default ProductVariantCreatorSummary;
