import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CollectionList_collections_edges_node } from "../../types/CollectionList";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colAvailability: {
        width: 240
      },
      colName: {
        paddingLeft: 0
      },
      colProducts: {
        width: 240
      }
    },
    colAvailability: {},
    colName: {},
    colProducts: {
      textAlign: "center"
    },
    tableRow: {
      cursor: "pointer" as "pointer"
    }
  }),
  { name: "CollectionList" }
);

interface CollectionListProps
  extends ListProps,
    ListActions,
    SortPage<CollectionListUrlSortField>,
    ChannelProps {
  collections: CollectionList_collections_edges_node[];
  channelsCount: number;
}

const numberOfColumns = 4;

const CollectionList: React.FC<CollectionListProps> = props => {
  const {
    channelsCount,
    collections,
    disabled,
    settings,
    sort,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    pageInfo,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
    toolbar
  } = props;

  const classes = useStyles(props);

  return (
    <ResponsiveTable>
      <TableHead
        colSpan={numberOfColumns}
        selected={selected}
        disabled={disabled}
        items={collections}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === CollectionListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(CollectionListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage defaultMessage="Collection Name" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === CollectionListUrlSortField.productCount
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(CollectionListUrlSortField.productCount)}
          className={classes.colProducts}
        >
          <FormattedMessage defaultMessage="No. of Products" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === CollectionListUrlSortField.available
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(CollectionListUrlSortField.available)}
          className={classes.colAvailability}
        >
          <FormattedMessage
            defaultMessage="Availability"
            description="collection availability"
          />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={numberOfColumns}
            settings={settings}
            hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
            onNextPage={onNextPage}
            onUpdateListSettings={onUpdateListSettings}
            hasPreviousPage={
              pageInfo && !disabled ? pageInfo.hasPreviousPage : false
            }
            onPreviousPage={onPreviousPage}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          collections,
          collection => {
            const isSelected = collection ? isChecked(collection.id) : false;
            const channel = collection?.channelListings.find(
              listing => listing.channel.id === selectedChannelId
            );
            return (
              <TableRow
                className={classes.tableRow}
                hover={!!collection}
                onClick={collection ? onRowClick(collection.id) : undefined}
                key={collection ? collection.id : "skeleton"}
                selected={isSelected}
                data-test="id"
                data-test-id={maybe(() => collection.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(collection.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName} data-test="name">
                  {maybe<React.ReactNode>(() => collection.name, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colProducts}>
                  {maybe<React.ReactNode>(
                    () => collection.products.totalCount,
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colAvailability}
                  data-test="availability"
                  data-test-availability={!!collection?.channelListings?.length}
                >
                  {collection && !collection?.channelListings?.length ? (
                    "-"
                  ) : collection?.channelListings !== undefined ? (
                    <ChannelsAvailabilityDropdown
                      allChannelsCount={channelsCount}
                      currentChannel={channel}
                      channels={collection?.channelListings}
                    />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No collections found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

CollectionList.displayName = "CollectionList";
export default CollectionList;
