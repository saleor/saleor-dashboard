import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTitle from "@saleor/components/CardTitle";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe, renderCollection } from "../../../misc";
import { ChannelProps, ListActions, PageListProps } from "../../../types";
import { CollectionDetails_collection } from "../../types/CollectionDetails";

const useStyles = makeStyles(
  theme => ({
    colActions: {
      "&:last-child": {
        paddingRight: 0
      },
      width: 76 + theme.spacing(0.5)
    },
    colName: {
      paddingLeft: 0,
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
  }),
  { name: "CollectionProducts" }
);

export interface CollectionProductsProps
  extends PageListProps,
    ListActions,
    ChannelProps {
  collection: CollectionDetails_collection;
  channelsCount: number;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
}

const numberOfColumns = 5;

const CollectionProducts: React.FC<CollectionProductsProps> = props => {
  const {
    channelsCount,
    collection,
    disabled,
    onAdd,
    onNextPage,
    onPreviousPage,
    onProductUnassign,
    onRowClick,
    pageInfo,
    selectedChannelId,
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
        title={
          !!collection ? (
            intl.formatMessage(
              {
                defaultMessage: "Products in {name}",
                description: "products in collection"
              },
              {
                name: maybe(() => collection.name, "...")
              }
            )
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
            />
          </Button>
        }
      />
      <ResponsiveTable className={classes.table}>
        <TableHead
          colSpan={numberOfColumns}
          selected={selected}
          disabled={disabled}
          items={maybe(() => collection.products.edges.map(edge => edge.node))}
          toggleAll={toggleAll}
          toolbar={toolbar}
        >
          <TableCell className={classes.colName}>
            <span className={classes.colNameLabel}>
              <FormattedMessage
                defaultMessage="Name"
                description="product name"
              />
            </span>
          </TableCell>
          <TableCell className={classes.colType}>
            <FormattedMessage
              defaultMessage="Type"
              description="product type"
            />
          </TableCell>
          <TableCell className={classes.colPublished}>
            <FormattedMessage
              defaultMessage="Availability"
              description="product availability"
            />
          </TableCell>
          <TableCell className={classes.colActions} />
        </TableHead>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={numberOfColumns}
              hasNextPage={pageInfo?.hasNextPage}
              onNextPage={onNextPage}
              hasPreviousPage={pageInfo?.hasPreviousPage}
              onPreviousPage={onPreviousPage}
            />
          </TableRow>
        </TableFooter>
        <TableBody>
          {renderCollection(
            maybe(() => collection.products.edges.map(edge => edge.node)),
            product => {
              const isSelected = product ? isChecked(product.id) : false;
              const channel =
                product?.channelListings.find(
                  listing => listing.channel.id === selectedChannelId
                ) || product?.channelListings[0];

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
                  <TableCell className={classes.colType}>
                    {product && !product?.channelListings?.length ? (
                      "-"
                    ) : product?.channelListings !== undefined ? (
                      <ChannelsAvailabilityDropdown
                        allChannelsCount={channelsCount}
                        currentChannel={channel}
                        channels={product?.channelListings}
                      />
                    ) : (
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
                  <FormattedMessage defaultMessage="No products found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
