import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import { CollectionListUrlSortField } from "@saleor/collections/urls";
import { canBeSorted } from "@saleor/collections/views/CollectionList/sort";
import { ChannelsAvailabilityDropdown } from "@saleor/components/ChannelsAvailabilityDropdown";
import {
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel
} from "@saleor/components/ChannelsAvailabilityDropdown/utils";
import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import TooltipTableCellHeader from "@saleor/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@saleor/components/TooltipTableCellHeader/messages";
import { CollectionListQuery } from "@saleor/graphql";
import { makeStyles, Pill } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import {
  ChannelProps,
  ListActions,
  ListProps,
  RelayToFlat,
  SortPage
} from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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

export interface CollectionListProps
  extends ListProps,
    ListActions,
    SortPage<CollectionListUrlSortField>,
    ChannelProps {
  collections: RelayToFlat<CollectionListQuery["collections"]>;
}

const numberOfColumns = 4;

const CollectionList: React.FC<CollectionListProps> = props => {
  const {
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
    toolbar,
    filterDependency
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

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
        <TooltipTableCellHeader
          direction={
            sort.sort === CollectionListUrlSortField.available
              ? getArrowDirection(sort.asc)
              : undefined
          }
          onClick={() => onSort(CollectionListUrlSortField.available)}
          className={classes.colAvailability}
          disabled={
            !canBeSorted(
              CollectionListUrlSortField.available,
              !!selectedChannelId
            )
          }
          tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
            filterName: filterDependency.label
          })}
        >
          <FormattedMessage
            defaultMessage="Availability"
            description="collection availability"
          />
        </TooltipTableCellHeader>
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
            const channel = collection?.channelListings?.find(
              listing => listing?.channel?.id === selectedChannelId
            );
            return (
              <TableRow
                className={classes.tableRow}
                hover={!!collection}
                onClick={collection ? onRowClick(collection.id) : undefined}
                key={collection ? collection.id : "skeleton"}
                selected={isSelected}
                data-test-id={"id-" + maybe(() => collection.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(collection.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName} data-test-id="name">
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
                  data-test-id="availability"
                  data-test-availability={!!collection?.channelListings?.length}
                >
                  {(!collection && <Skeleton />) ||
                    (channel ? (
                      <Pill
                        label={intl.formatMessage(
                          getChannelAvailabilityLabel(channel)
                        )}
                        color={getChannelAvailabilityColor(channel)}
                      />
                    ) : (
                      <ChannelsAvailabilityDropdown
                        channels={collection?.channelListings}
                      />
                    ))}
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
