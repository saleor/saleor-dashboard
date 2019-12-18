import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps, SortPage } from "@saleor/types";
import { CollectionListUrlSortField } from "@saleor/collections/urls";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { getArrowDirection } from "@saleor/utils/sort";
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
    SortPage<CollectionListUrlSortField> {
  collections: CollectionList_collections_edges_node[];
}

const numberOfColumns = 5;

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
    toggle,
    toggleAll,
    toolbar
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
            return (
              <TableRow
                className={classes.tableRow}
                hover={!!collection}
                onClick={collection ? onRowClick(collection.id) : undefined}
                key={collection ? collection.id : "skeleton"}
                selected={isSelected}
                data-tc="id"
                data-tc-id={maybe(() => collection.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(collection.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName} data-tc="name">
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
                  data-tc="published"
                  data-tc-published={maybe(() => collection.isPublished)}
                >
                  {maybe(
                    () => (
                      <StatusLabel
                        status={collection.isPublished ? "success" : "error"}
                        label={
                          collection.isPublished
                            ? intl.formatMessage({
                                defaultMessage: "Published",
                                description: "collection is published"
                              })
                            : intl.formatMessage({
                                defaultMessage: "Not published",
                                description: "collection is not published"
                              })
                        }
                      />
                    ),
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
