import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
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
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CardTitle from "@saleor/components/CardTitle";
import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "../../../misc";
import { ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";

const styles = (theme: Theme) =>
  createStyles({
    colActions: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 48 + theme.spacing.unit / 2
    },
    colName: {
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colPublished: {
      width: 200
    },
    colType: {
      width: 200
    },
    table: {
      tableLayout: "fixed"
    },
    tableRow: {
      cursor: "pointer"
    }
  });

export interface CollectionProductsProps
  extends PageListProps,
    ListActions,
    WithStyles<typeof styles> {
  collection: CollectionDetails_collection;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
}

const numberOfColumns = 5;

const CollectionProducts = withStyles(styles, { name: "CollectionProducts" })(
  ({
    classes,
    collection,
    disabled,
    onAdd,
    onNextPage,
    onPreviousPage,
    onProductUnassign,
    onRowClick,
    pageInfo,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: CollectionProductsProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={
            !!collection ? (
              intl.formatMessage({
                defaultMessage: "Products in {name}",
                description: "products in collection",
                id: "collectionProductsHeader"
              })
            ) : (
              <Skeleton />
            )
          }
          toolbar={
            <Button
              disabled={disabled}
              variant="text"
              color="primary"
              onClick={onAdd}
            >
              <FormattedMessage
                defaultMessage="Assign product"
                description="button"
                id="collectionProductsAssignProductButton"
              />
            </Button>
          }
        />
        <Table className={classes.table}>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={maybe(() =>
              collection.products.edges.map(edge => edge.node)
            )}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <span className={classes.colNameLabel}>
                <FormattedMessage
                  defaultMessage="Name"
                  description="product name"
                  id="collectionProductsNameColumnHeader"
                />
              </span>
            </TableCell>
            <TableCell className={classes.colType}>
              <FormattedMessage
                defaultMessage="Type"
                description="product type"
                id="collectionProductsTypeProductList"
              />
            </TableCell>
            <TableCell className={classes.colPublished}>
              <FormattedMessage
                defaultMessage="Published"
                description="product is published"
                id="collectionPublishedColumnHeader"
              />
            </TableCell>
            <TableCell className={classes.colActions} />
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                hasNextPage={maybe(() => pageInfo.hasNextPage)}
                onNextPage={onNextPage}
                hasPreviousPage={maybe(() => pageInfo.hasPreviousPage)}
                onPreviousPage={onPreviousPage}
              />
            </TableRow>
          </TableFooter>
          <TableBody>
            {renderCollection(
              maybe(() => collection.products.edges.map(edge => edge.node)),
              product => {
                const isSelected = product ? isChecked(product.id) : false;

                return (
                  <TableRow
                    className={classes.tableRow}
                    hover={!!product}
                    onClick={!!product ? onRowClick(product.id) : undefined}
                    key={product ? product.id : "skeleton"}
                    selected={isSelected}
                  >
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
                      thumbnail={maybe(() => product.thumbnail.url)}
                    >
                      {maybe<React.ReactNode>(() => product.name, <Skeleton />)}
                    </TableCellAvatar>
                    <TableCell className={classes.colType}>
                      {maybe<React.ReactNode>(
                        () => product.productType.name,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colPublished}>
                      {maybe(
                        () => (
                          <StatusLabel
                            label={
                              product.isPublished
                                ? intl.formatMessage({
                                    defaultMessage: "Published",
                                    description: "product is published",
                                    id: "collectionProductsPublished"
                                  })
                                : intl.formatMessage({
                                    defaultMessage: "Not published",
                                    description: "product is not published",
                                    id: "collectionProductsNotPublished"
                                  })
                            }
                            status={product.isPublished ? "success" : "error"}
                          />
                        ),
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colActions}>
                      <IconButton
                        disabled={!product}
                        onClick={event => onProductUnassign(product.id, event)}
                      >
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              },
              () => (
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage
                      defaultMessage="No products found"
                      id="collectionProductsNoProducts"
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
CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
