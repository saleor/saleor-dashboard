import {
  Card,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { TableButtonWrapper } from "@saleor/components/TableButtonWrapper/TableButtonWrapper";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import { CollectionDetailsQuery } from "@saleor/graphql";
import { DeleteIcon, IconButton, makeStyles } from "@saleor/macaw-ui";
import { productUrl } from "@saleor/products/urls";
import { mapEdgesToItems } from "@saleor/utils/maps";
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
    <Card>
      <CardTitle
        title={
          !!collection ? (
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
          )
        }
        toolbar={
          <Button
            data-test-id="add-product"
            disabled={disabled}
            variant="tertiary"
            onClick={onAdd}
          >
            <FormattedMessage
              id="scHVdW"
              defaultMessage="Assign product"
              description="button"
            />
          </Button>
        }
      />
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
              <FormattedMessage
                id="6AMFki"
                defaultMessage="Name"
                description="product name"
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              id="k+HcTv"
              defaultMessage="Type"
              description="product type"
            />
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
          <TableRow>
            <TablePaginationWithContext colSpan={numberOfColumns} />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            products,
            product => {
              const isSelected = product ? isChecked(product.id) : false;

              return (
                <TableRowLink
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
                    {maybe<React.ReactNode>(
                      () => product.productType.name,
                      <Skeleton />,
                    )}
                  </TableCell>
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown
                        channels={product?.channelListings}
                      />
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
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage
                    id="Q1Uzbb"
                    defaultMessage="No products found"
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
