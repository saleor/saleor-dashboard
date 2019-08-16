import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";

const styles = (theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.main,
      cursor: "pointer"
    },
    textLeft: {
      textAlign: "left"
    }
  });

interface ProductListProps extends WithStyles<typeof styles> {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  products?: Array<{
    id: string;
    name: string;
    productType: {
      name: string;
    };
    thumbnail: {
      url: string;
    };
  }>;
  onAddProduct?();
  onNextPage?();
  onPreviousPage?();
  onRowClick?(id: string): () => void;
}

export const ProductList = withStyles(styles, { name: "ProductList" })(
  ({
    classes,
    hasNextPage,
    hasPreviousPage,
    products,
    onAddProduct,
    onNextPage,
    onPreviousPage,
    onRowClick
  }: ProductListProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Products",
            description: "section header",
            id: "categoryProductsHeader"
          })}
          toolbar={
            <Button variant="text" color="primary" onClick={onAddProduct}>
              <FormattedMessage
                defaultMessage="Add product"
                description="button"
                id="categoryProductsAddProductButton"
              />
            </Button>
          }
        />
        <Table>
          <TableHead>
            <TableRow>
              {(products === undefined || products.length > 0) && <TableCell />}
              <TableCell className={classes.textLeft}>
                <FormattedMessage
                  defaultMessage="Name"
                  description="product list: product name column header"
                  id="categoryProductsNameHeader"
                />
              </TableCell>
              <TableCell>
                <FormattedMessage
                  defaultMessage="Type"
                  description="product list: product type column header"
                  id="categoryProductsTypeHeader"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                hasNextPage={hasNextPage}
                onNextPage={onNextPage}
                hasPreviousPage={hasPreviousPage}
                onPreviousPage={onPreviousPage}
              />
            </TableRow>
          </TableFooter>
          <TableBody>
            {renderCollection(
              products,
              product => (
                <TableRow key={product ? product.id : "skeleton"}>
                  <TableCellAvatar
                    thumbnail={maybe(() => product.thumbnail.url)}
                  />
                  <TableCell className={classes.textLeft}>
                    {product ? (
                      <span
                        onClick={onRowClick && onRowClick(product.id)}
                        className={classes.link}
                      >
                        {product.name}
                      </span>
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell>
                    {product && product.productType ? (
                      product.productType.name
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={3}>
                    <FormattedMessage
                      defaultMessage="No products found"
                      id="categoryProductsNoProducts"
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Card>
    );
  }
);
ProductList.displayName = "CategoryProductList";
export default ProductList;
