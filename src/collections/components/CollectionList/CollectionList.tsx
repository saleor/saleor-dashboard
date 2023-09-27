// @ts-strict-ignore
import {
  CollectionListUrlSortField,
  collectionUrl,
} from "@dashboard/collections/urls";
import { canBeSorted } from "@dashboard/collections/views/CollectionList/sort";
import { ChannelsAvailabilityDropdown } from "@dashboard/components/ChannelsAvailabilityDropdown";
import {
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel,
} from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import Checkbox from "@dashboard/components/Checkbox";
import { Pill } from "@dashboard/components/Pill";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import TooltipTableCellHeader from "@dashboard/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { CollectionListQuery } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import {
  ChannelProps,
  ListActions,
  ListProps,
  RelayToFlat,
  SortPage,
} from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colAvailability: {
        width: 240,
      },
      colName: {
        paddingLeft: 0,
      },
      colProducts: {
        width: 240,
      },
    },
    colAvailability: {},
    colName: {},
    colProducts: {
      textAlign: "center",
    },
    tableRow: {
      cursor: "pointer" as "pointer",
    },
  }),
  { name: "CollectionList" },
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
    onUpdateListSettings,
    onSort,
    isChecked,
    selected,
    selectedChannelId,
    toggle,
    toggleAll,
    toolbar,
    filterDependency,
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
          <FormattedMessage id="VZsE96" defaultMessage="Collection Name" />
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
          <FormattedMessage id="mWQt3s" defaultMessage="No. of Products" />
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
              !!selectedChannelId,
            )
          }
          tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
            filterName: filterDependency.label,
          })}
        >
          <FormattedMessage
            id="UxdBmI"
            defaultMessage="Availability"
            description="collection availability"
          />
        </TooltipTableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRowLink>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRowLink>
      </TableFooter>
      <TableBody>
        {renderCollection(
          collections,
          collection => {
            const isSelected = collection ? isChecked(collection.id) : false;
            const channel = collection?.channelListings?.find(
              listing => listing?.channel?.id === selectedChannelId,
            );
            return (
              <TableRowLink
                className={classes.tableRow}
                hover={!!collection}
                href={collection && collectionUrl(collection.id)}
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
                    <Skeleton />,
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
                          getChannelAvailabilityLabel(channel),
                        )}
                        color={getChannelAvailabilityColor(channel)}
                      />
                    ) : (
                      <ChannelsAvailabilityDropdown
                        channels={collection?.channelListings}
                      />
                    ))}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="Yw+9F7"
                  defaultMessage="No collections found"
                />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

CollectionList.displayName = "CollectionList";
export default CollectionList;
