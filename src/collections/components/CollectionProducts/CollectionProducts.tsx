// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { ChannelsAvailabilityDropdown } from "@dashboard/components/ChannelsAvailabilityDropdown";
import Checkbox from "@dashboard/components/Checkbox";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@dashboard/components/TableCellAvatar/Avatar";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CollectionDetailsQuery } from "@dashboard/graphql";
import { productUrl } from "@dashboard/products/urls";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ListActions, PageListProps } from "../../../types";

const useStyles = makeStyles(
  theme => ({
    colActions: {
      width: `calc(76px + ${theme.spacing(1)})`,
      marginRight: theme.spacing(-2),
    },
    colName: {
      paddingLeft: 0,
      width: "auto",
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN,
    },
    colPublished: {
      width: 200,
    },
    colType: {
      width: 200,
    },
    table: {
      tableLayout: "fixed",
    },
    tableRow: {
      cursor: "pointer",
    },
  }),
  { name: "CollectionProducts" },
);

export interface CollectionProductsProps extends PageListProps, ListActions {
  collection: CollectionDetailsQuery["collection"];
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onAdd: () => void;
}

const CollectionProducts: React.FC<CollectionProductsProps> = props => {
  const {
    collection,
    disabled,
    onAdd,
    onProductUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const products = mapEdgesToItems(collection?.products);
  const numberOfColumns = products?.length === 0 ? 4 : 5;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title
          toolbar={
            <Button
              data-test-id="add-product"
              disabled={disabled}
              variant="tertiary"
              onClick={onAdd}
            >
              <FormattedMessage id="scHVdW" defaultMessage="Assign product" description="button" />
            </Button>
          }
        >
          {collection ? (
            intl.formatMessage(
              {
                id: "/dnWE8",
                defaultMessage: "Products in {name}",
                description: "products in collection",
              },
              {
                name: maybe(() => collection.name, "..."),
              },
            )
          ) : (
            <Skeleton />
          )}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <ResponsiveTable className={classes.table}>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={mapEdgesToItems(collection?.products)}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={classes.colNameLabel}>
              <FormattedMessage id="6AMFki" defaultMessage="Name" description="product name" />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage id="k+HcTv" defaultMessage="Type" description="product type" />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              id="Oe62bR"
              defaultMessage="Availability"
              description="product availability"
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRowLink>
            <TablePaginationWithContext colSpan={numberOfColumns} />
          </TableRowLink>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRowLink
                  data-test-id="assign-product-table-row"
                  className={classes.tableRow}
                  hover={!!product}
                  href={product && productUrl(product.id)}
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
                    {maybe<React.ReactNode>(() => product.productType.name, <Skeleton />)}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown channels={product?.channelListings} />
                    ) : (
                      <Skeleton />
                    )}
                  </TableCell>
                  <TableCell className={classes.colActions}>
                    <TableButtonWrapper>
                      <IconButton
                        data-test-id="delete-icon"
                        variant="secondary"
                        disabled={!product}
                        onClick={event => onProductUnassign(product.id, event)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableButtonWrapper>
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage id="Q1Uzbb" defaultMessage="No products found" />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </DashboardCard>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
