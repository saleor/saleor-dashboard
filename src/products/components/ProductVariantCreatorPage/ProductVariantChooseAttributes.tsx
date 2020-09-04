import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import MuiTableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { commonMessages } from "@saleor/intl";
import { renderCollection } from "@saleor/misc";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ListActionsWithoutToolbar } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ProductVariantChooseAttributesProps
  extends ListActionsWithoutToolbar {
  attributes: ProductDetails_product_productType_variantAttributes[];
}

const numberOfColumns = 6;

const useStyles = makeStyles(
  () => ({
    colAttribute: {
      width: 150
    }
  }),
  { name: "ProductVariantChooseAttributes" }
);

const ProductVariantChooseAttributes: React.FC<ProductVariantChooseAttributesProps> = props => {
  const { attributes, isChecked, selected, toggle, toggleAll } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  const positive = intl.formatMessage(commonMessages.yes);
  const negative = intl.formatMessage(commonMessages.no);

  return (
    <Card>
      <ResponsiveTable>
        <MuiTableHead>
          <TableRow>
            {(attributes === undefined || attributes.length > 0) && (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    attributes && attributes.length > selected && selected > 0
                  }
                  checked={selected === 0 ? false : true}
                  disabled={false}
                  onChange={() => toggleAll(attributes, selected)}
                />
              </TableCell>
            )}
            <TableCell>
              <FormattedMessage defaultMessage="Attribute code" />
            </TableCell>
            <TableCell className={classes.colAttribute}>
              <FormattedMessage
                defaultMessage="Default label"
                description="table column title"
              />
            </TableCell>
            <TableCell className={classes.colAttribute}>
              <FormattedMessage
                defaultMessage="Required"
                description="table column title"
              />
            </TableCell>
            <TableCell className={classes.colAttribute}>
              <FormattedMessage
                defaultMessage="Visible"
                description="table column title"
              />
            </TableCell>
            <TableCell className={classes.colAttribute}>
              <FormattedMessage
                defaultMessage="Use as filter in storefront"
                description="table column title"
              />
            </TableCell>
          </TableRow>
        </MuiTableHead>
        <TableBody>
          {renderCollection(
            attributes,
            attribute => {
              const isSelected = attribute ? isChecked(attribute.id) : false;
              return (
                <TableRow key={attribute ? attribute.id : "skeleton"}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={!!attribute.valueRequired}
                      disableClickPropagation
                      onChange={() => toggle(attribute.id)}
                    />
                  </TableCell>
                  <TableCell>{attribute?.slug || <Skeleton />}</TableCell>
                  <TableCell className={classes.colAttribute}>
                    {attribute?.name || <Skeleton />}
                  </TableCell>
                  <TableCell className={classes.colAttribute}>
                    {attribute?.valueRequired ? positive : negative}
                  </TableCell>
                  <TableCell className={classes.colAttribute}>
                    {attribute?.visibleInStorefront ? positive : negative}
                  </TableCell>
                  <TableCell className={classes.colAttribute}>
                    {attribute?.filterableInStorefront ? positive : negative}
                  </TableCell>
                </TableRow>
              );
            },
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage defaultMessage="No attributes found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

ProductVariantChooseAttributes.displayName = "ProductVariantChooseAttributes";
export default ProductVariantChooseAttributes;
