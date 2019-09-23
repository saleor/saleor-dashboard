import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Hr from "@saleor/components/Hr";
import { ProductVariantCreateInput } from "@saleor/types/globalTypes";
import { ProductDetails_product_productType_variantAttributes } from "../../types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";

export interface ProductVariantCreateSummaryProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  currencySymbol: string;
  data: ProductVariantCreateFormData;
}

const useStyles = makeStyles((theme: Theme) => ({
  col: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  colName: {
    paddingLeft: "0 !important",
    width: "auto"
  },
  colPrice: {
    width: 160
  },
  colSku: {
    width: 210
  },
  colStock: {
    width: 160
  },
  hr: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit / 2
  },
  input: {
    "& input": {
      padding: "16px 12px 17px"
    },
    marginTop: theme.spacing.unit / 2,
    width: 104
  }
}));

function getVariantName(
  variant: ProductVariantCreateInput,
  attributes: ProductDetails_product_productType_variantAttributes[]
): string[] {
  return attributes.reduce(
    (acc, attribute) => [
      ...acc,
      attribute.values.find(
        value =>
          value.id ===
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
  const { attributes, currencySymbol, data } = props;
  const classes = useStyles(props);

  return (
    <>
      <Typography color="textSecondary" variant="headline">
        <FormattedMessage
          defaultMessage="You will create variants below"
          description="header"
        />
      </Typography>
      <Hr className={classes.hr} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classNames(classes.col, classes.colName)}>
              <FormattedMessage
                defaultMessage="Variant"
                description="variant name"
              />
            </TableCell>
            <TableCell className={classNames(classes.col, classes.colStock)}>
              <FormattedMessage
                defaultMessage="Inventory"
                description="variant stock amount"
              />
            </TableCell>
            <TableCell className={classNames(classes.col, classes.colPrice)}>
              <FormattedMessage
                defaultMessage="Price"
                description="variant price"
              />
            </TableCell>
            <TableCell className={classNames(classes.col, classes.colSku)}>
              <FormattedMessage defaultMessage="SKU" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.variants.map(variant => (
            <TableRow
              key={variant.attributes.map(attribute => attribute.id).join(":")}
            >
              <TableCell className={classNames(classes.col, classes.colName)}>
                {getVariantName(variant, attributes).join(" ")}
              </TableCell>
              <TableCell className={classNames(classes.col, classes.colStock)}>
                <TextField
                  className={classes.input}
                  inputProps={{
                    min: 0,
                    type: "number"
                  }}
                  fullWidth
                  value={variant.quantity}
                />
              </TableCell>
              <TableCell className={classNames(classes.col, classes.colPrice)}>
                <TextField
                  InputProps={{
                    endAdornment: currencySymbol
                  }}
                  className={classes.input}
                  inputProps={{
                    min: 0,
                    type: "number"
                  }}
                  fullWidth
                  value={variant.priceOverride}
                />
              </TableCell>
              <TableCell className={classNames(classes.col, classes.colSku)}>
                <TextField
                  className={classes.input}
                  fullWidth
                  value={variant.sku}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

ProductVariantCreateSummary.displayName = "ProductVariantCreateSummary";
export default ProductVariantCreateSummary;
