import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import purple from "@material-ui/core/colors/purple";
import yellow from "@material-ui/core/colors/yellow";
import IconButton from "@material-ui/core/IconButton";
import { Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

import Hr from "@saleor/components/Hr";
import { maybe } from "@saleor/misc";
import { ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductVariantBulkCreateInput } from "@saleor/types/globalTypes";
import { ProductDetails_product_productType_variantAttributes } from "../../types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";
import { VariantField } from "./reducer";

export interface ProductVariantCreateSummaryProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_bulkProductErrors[];
  onVariantDataChange: (
    variantIndex: number,
    field: VariantField,
    value: string
  ) => void;
  onVariantDelete: (variantIndex: number) => void;
}

const colors = [blue, cyan, green, purple, yellow].map(color => color[800]);

const useStyles = makeStyles(
  (theme: Theme) => ({
    attributeValue: {
      display: "inline-block",
      marginRight: theme.spacing.unit
    },
    col: {
      ...theme.typography.body2,
      fontSize: 14,
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit
    },
    colHeader: {
      ...theme.typography.body2,
      fontSize: 14
    },
    colName: {
      "&&": {
        paddingLeft: "0 !important"
      },
      "&:not($colHeader)": {
        paddingTop: theme.spacing.unit * 2
      }
    },
    colPrice: {},
    colSku: {},
    colStock: {},
    delete: {
      marginTop: theme.spacing.unit / 2
    },
    errorRow: {},
    hr: {
      marginBottom: theme.spacing.unit,
      marginTop: theme.spacing.unit / 2
    },
    input: {
      "& input": {
        padding: "16px 12px 17px"
      },
      marginTop: theme.spacing.unit / 2
    },
    row: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "grid",
      gridTemplateColumns: "1fr 180px 120px 180px 64px",
      padding: `${theme.spacing.unit}px 0`
    }
  }),
  {
    name: "ProductVariantCreateSummary"
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

const ProductVariantCreateSummary: React.FC<
  ProductVariantCreateSummaryProps
> = props => {
  const {
    attributes,
    currencySymbol,
    data,
    errors,
    onVariantDataChange,
    onVariantDelete
  } = props;
  const classes = useStyles(props);

  return (
    <>
      <Typography color="textSecondary" variant="h5">
        <FormattedMessage
          defaultMessage="You will create variants below"
          description="header"
        />
      </Typography>
      <Hr className={classes.hr} />
      <div>
        <div className={classes.row}>
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
          <div
            className={classNames(
              classes.col,
              classes.colHeader,
              classes.colStock
            )}
          >
            <FormattedMessage
              defaultMessage="Inventory"
              description="variant stock amount"
            />
          </div>
          <div
            className={classNames(
              classes.col,
              classes.colHeader,
              classes.colSku
            )}
          >
            <FormattedMessage defaultMessage="SKU" />
          </div>
        </div>
        {data.variants.map((variant, variantIndex) => {
          const variantErrors = errors.filter(
            error => error.index === variantIndex
          );

          return (
            <div
              className={classNames(classes.row, {
                [classes.errorRow]: variantErrors.length > 0
              })}
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
                      key={value}
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
                  error={
                    !!variantErrors.find(
                      error => error.field === "priceOverride"
                    )
                  }
                  helperText={maybe(
                    () =>
                      variantErrors.find(
                        error => error.field === "priceOverride"
                      ).message
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
              <div className={classNames(classes.col, classes.colStock)}>
                <TextField
                  className={classes.input}
                  error={
                    !!variantErrors.find(error => error.field === "quantity")
                  }
                  helperText={maybe(
                    () =>
                      variantErrors.find(error => error.field === "quantity")
                        .message
                  )}
                  inputProps={{
                    min: 0,
                    type: "number"
                  }}
                  fullWidth
                  value={variant.quantity}
                  onChange={event =>
                    onVariantDataChange(
                      variantIndex,
                      "stock",
                      event.target.value
                    )
                  }
                />
              </div>
              <div className={classNames(classes.col, classes.colSku)}>
                <TextField
                  className={classes.input}
                  error={!!variantErrors.find(error => error.field === "sku")}
                  helperText={maybe(
                    () =>
                      variantErrors.find(error => error.field === "sku").message
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
            </div>
          );
        })}
      </div>
    </>
  );
};

ProductVariantCreateSummary.displayName = "ProductVariantCreateSummary";
export default ProductVariantCreateSummary;
