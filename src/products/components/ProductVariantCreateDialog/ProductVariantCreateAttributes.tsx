import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import { maybe, renderCollection } from "@saleor/misc";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import { ProductVariantCreateFormData } from "./form";

export interface ProductVariantCreateAttributesProps {
  attributes: ProductDetails_product_productType_variantAttributes[];
  data: ProductVariantCreateFormData;
  onAttributeClick: (id: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  checkboxCell: {
    paddingLeft: 0
  },
  wideCell: {
    width: "100%"
  }
}));

const ProductVariantCreateAttributes: React.FC<
  ProductVariantCreateAttributesProps
> = props => {
  const { attributes, data, onAttributeClick } = props;
  const classes = useStyles(props);

  return (
    <Table key="table">
      <TableBody>
        {renderCollection(
          attributes,
          attribute => {
            if (!attribute) {
              return null;
            }
            const isChecked = !!data.attributes.find(
              selectedAttribute => selectedAttribute === attribute.id
            );

            return (
              <TableRow key={maybe(() => attribute.id)}>
                <TableCell padding="checkbox" className={classes.checkboxCell}>
                  <Checkbox
                    checked={isChecked}
                    disableClickPropagation={true}
                    onChange={() => onAttributeClick(attribute.id)}
                  />
                </TableCell>
                <TableCell className={classes.wideCell}>
                  {attribute.name}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={2}>
                <FormattedMessage defaultMessage="This product type has no variant attributes" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
};

ProductVariantCreateAttributes.displayName = "ProductVariantCreateAttributes";
export default ProductVariantCreateAttributes;
