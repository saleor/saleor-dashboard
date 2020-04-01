import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
import green from "@material-ui/core/colors/green";
import purple from "@material-ui/core/colors/purple";
import yellow from "@material-ui/core/colors/yellow";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductVariantBulkCreate_productVariantBulkCreate_errors } from "@saleor/products/types/ProductVariantBulkCreate";
import { ProductVariantBulkCreateInput } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import { getBulkProductErrorMessage } from "@saleor/utils/errors/product";
import CardTitle from "@saleor/components/CardTitle";
import { commonMessages } from "@saleor/intl";
import { ProductDetails_product_productType_variantAttributes } from "../../types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";
import { VariantField } from "./reducer";

export interface ProductVariantCreatorSummaryProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
  errors: ProductVariantBulkCreate_productVariantBulkCreate_errors[];
  onVariantDataChange: (
    variantIndex: number,
    field: VariantField,
    value: string
  ) => void;
  onVariantDelete: (variantIndex: number) => void;
}

const colors = [blue, cyan, green, purple, yellow].map(color => color[800]);

const useStyles = makeStyles(
  theme => ({
    attributeValue: {
      display: "inline-block",
      marginRight: theme.spacing(1)
    },
    col: {
      ...theme.typography.body1,
      fontSize: 14,
      paddingLeft: theme.spacing(),
      paddingRight: theme.spacing(1)
    },
    colHeader: {
      ...theme.typography.body1,
      fontSize: 14
    },
    colName: {
      "&&": {
        paddingLeft: "0 !important"
      },
      "&:not($colHeader)": {
        paddingTop: theme.spacing(2)
      }
    },
    colPrice: {},
    colSku: {},
    colStock: {},
    delete: {
      marginTop: theme.spacing(0.5)
    },
    errorRow: {},
    hr: {
      marginBottom: theme.spacing(),
      marginTop: theme.spacing(0.5)
    },
    input: {
      "& input": {
        padding: "16px 12px 17px"
      },
      marginTop: theme.spacing(0.5)
    },
    row: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: "grid",
      gridTemplateColumns: "1fr 180px 120px 180px 64px",
      padding: theme.spacing(1, 1, 1, 3)
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
    onVariantDataChange,
    onVariantDelete
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(commonMessages.summary)} />
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
          const variantFormErrors = getFormErrors(
            ["priceOverride", "quantity", "sku"],
            variantErrors
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
              <div className={classNames(classes.col, classes.colStock)}>
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
            </div>
          );
        })}
      </div>
    </Card>
  );
};

ProductVariantCreatorSummary.displayName = "ProductVariantCreatorSummary";
export default ProductVariantCreatorSummary;
