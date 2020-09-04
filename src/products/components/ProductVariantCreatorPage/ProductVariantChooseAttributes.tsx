import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { renderCollection } from "@saleor/misc";
import { ProductDetails_product_productType_availableAttributes_edges_node } from "@saleor/products/types/ProductDetails";
import { ListActions } from "@saleor/types";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface ProductVariantChooseAttributesProps extends ListActions {
  availableAttributes: ProductDetails_product_productType_availableAttributes_edges_node[];
}

const numberOfColumns = 7;

const useStyles = makeStyles(
  theme => ({
    colNote: {
      width: 200
    }
  }),
  { name: "ProductVariantChooseAttributes" }
);

const ProductVariantChooseAttributes: React.FC<ProductVariantChooseAttributesProps> = props => {
  const {
    availableAttributes,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;
  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead
          // colSpan={numberOfColumns}
          // selected={selected}
          // disabled={disabled}
          items={availableAttributes}
          // toggleAll={toggleAll}
          // toolbar={toolbar}
        >
          <TableRow>
            <TableCell className={classes.colNote}>
              <FormattedMessage defaultMessage="Attribute code" />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Default label"
                description="table header label"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Actions"
                description="table actions"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Required"
                description="table actions"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Visible"
                description="table actions"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Searchable"
                description="table actions"
              />
            </TableCell>
            <TableCell>
              <FormattedMessage
                defaultMessage="Use in faceted search"
                description="table actions"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            availableAttributes,
            attribute => {
              const isSelected = attribute ? isChecked(attribute.id) : false;
              return (
                <TableRow key={attribute ? attribute.id : "skeleton"}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={!!attribute.valueRequired && isSelected}
                      disableClickPropagation
                      onChange={() => {
                        toggle(attribute.id);
                      }}
                    />
                  </TableCell>
                  <TableCell className={classes.colNote}>
                    {attribute?.slug || <Skeleton />}
                  </TableCell>
                  <TableCell>{attribute?.name || <Skeleton />}</TableCell>
                  <TableCell>
                    {attribute?.valueRequired ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <TableCell>
                      {attribute?.valueRequired ? "Yes" : "No"}
                    </TableCell>
                  </TableCell>
                  <TableCell>
                    {attribute?.filterableInDashboard ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {attribute?.valueRequired ? "Yes" : "No"}
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
