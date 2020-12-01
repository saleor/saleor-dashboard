import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { renderCollection } from "@saleor/misc";
import { ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node } from "@saleor/shipping/types/ShippingZone";
import { ListActions, ListProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    colAction: {
      "&:last-child": {
        paddingRight: theme.spacing(3)
      },
      textAlign: "right",
      width: 100
    },
    colName: {
      width: "auto"
    },
    colProductName: {
      paddingLeft: 0
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "ShippingMethodProducts" }
);

export interface ShippingMethodProductsProps
  extends Pick<ListProps, Exclude<keyof ListProps, "onRowClick">>,
    ListActions {
  products: ShippingZone_shippingZone_shippingMethods_excludedProducts_edges_node[];
  onProductAssign: () => void;
  onProductUnassign: (ids: string[]) => void;
}

const numberOfColumns = 3;

const ShippingMethodProducts: React.FC<ShippingMethodProductsProps> = props => {
  const {
    disabled,
    pageInfo,
    products,
    onNextPage,
    onPreviousPage,
    onProductAssign,
    onProductUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Excluded Products",
          description: "section header"
        })}
        toolbar={
          <Button color="primary" variant="text" onClick={onProductAssign}>
            <FormattedMessage
              defaultMessage="Assign products"
              description="button"
            />
          </Button>
        }
      />
      <ResponsiveTable className={classes.table}>
        {!!products?.length && (
          <>
            <TableHead
              colSpan={numberOfColumns}
              selected={selected}
              disabled={disabled}
              items={products}
              toggleAll={toggleAll}
              toolbar={toolbar}
            >
              <TableCell className={classes.colProductName}>
                <FormattedMessage defaultMessage="Product Name" />
              </TableCell>
              <TableCell className={classes.colAction}>
                <FormattedMessage defaultMessage="Actions" />
              </TableCell>
            </TableHead>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={numberOfColumns}
                  hasNextPage={
                    pageInfo && !disabled ? pageInfo.hasNextPage : false
                  }
                  onNextPage={onNextPage}
                  hasPreviousPage={
                    pageInfo && !disabled ? pageInfo.hasPreviousPage : false
                  }
                  onPreviousPage={onPreviousPage}
                />
              </TableRow>
            </TableFooter>
          </>
        )}
        <TableBody>
          {products?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <FormattedMessage defaultMessage="No Products" />
              </TableCell>
            </TableRow>
          ) : (
            renderCollection(products, product => {
              const isSelected = product ? isChecked(product.id) : false;
              return (
                <TableRow key={product ? product.id : "skeleton"}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={disabled}
                      disableClickPropagation
                      onChange={() => toggle(product.id)}
                    />
                  </TableCell>
                  <TableCellAvatar
                    className={classes.colName}
                    thumbnail={product?.thumbnail?.url}
                  >
                    {product?.name ? (
                      <Typography variant="body2">{product.name}</Typography>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCellAvatar>
                  <TableCell className={classes.colAction}>
                    <IconButton onClick={() => onProductUnassign([product.id])}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
ShippingMethodProducts.displayName = "ShippingMethodProducts";
export default ShippingMethodProducts;
