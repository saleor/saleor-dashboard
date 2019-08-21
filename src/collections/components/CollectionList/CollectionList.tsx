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
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "@saleor/components/Checkbox";
import Skeleton from "@saleor/components/Skeleton";
import StatusLabel from "@saleor/components/StatusLabel";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { maybe, renderCollection } from "@saleor/misc";
import { ListActions, ListProps } from "@saleor/types";
import { CollectionList_collections_edges_node } from "../../types/CollectionList";

const styles = (theme: Theme) =>
  createStyles({
    [theme.breakpoints.up("lg")]: {
      colAvailability: {
        width: 240
      },
      colName: {},
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
  });

interface CollectionListProps
  extends ListProps,
    ListActions,
    WithStyles<typeof styles> {
  collections: CollectionList_collections_edges_node[];
}

const numberOfColumns = 5;

const CollectionList = withStyles(styles, { name: "CollectionList" })(
  ({
    classes,
    collections,
    disabled,
    settings,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    pageInfo,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar
  }: CollectionListProps) => {
    const intl = useIntl();

    return (
      <Card>
        <Table>
          <TableHead
            colSpan={numberOfColumns}
            selected={selected}
            disabled={disabled}
            items={collections}
            toggleAll={toggleAll}
            toolbar={toolbar}
          >
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Category Name"
                id="collectionListNameColumnHeader"
              />
            </TableCell>
            <TableCell className={classes.colProducts}>
              <FormattedMessage
                defaultMessage="No. of Products"
                id="collectionListProductsColumnHeader"
              />
            </TableCell>
            <TableCell className={classes.colAvailability}>
              <FormattedMessage
                defaultMessage="Availability"
                description="collection availability"
                id="collectionListAvailabilityColumnHeader"
              />
            </TableCell>
          </TableHead>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={numberOfColumns}
                settings={settings}
                hasNextPage={
                  pageInfo && !disabled ? pageInfo.hasNextPage : false
                }
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
                const isSelected = collection
                  ? isChecked(collection.id)
                  : false;
                return (
                  <TableRow
                    className={classes.tableRow}
                    hover={!!collection}
                    onClick={collection ? onRowClick(collection.id) : undefined}
                    key={collection ? collection.id : "skeleton"}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        disabled={disabled}
                        disableClickPropagation
                        onChange={() => toggle(collection.id)}
                      />
                    </TableCell>
                    <TableCell className={classes.colName}>
                      {maybe<React.ReactNode>(
                        () => collection.name,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colProducts}>
                      {maybe<React.ReactNode>(
                        () => collection.products.totalCount,
                        <Skeleton />
                      )}
                    </TableCell>
                    <TableCell className={classes.colAvailability}>
                      {maybe(
                        () => (
                          <StatusLabel
                            status={
                              collection.isPublished ? "success" : "error"
                            }
                            label={
                              collection.isPublished
                                ? intl.formatMessage({
                                    defaultMessage: "Published",
                                    description: "collection is published",
                                    id: "collectionListPublished"
                                  })
                                : intl.formatMessage({
                                    defaultMessage: "Not published",
                                    description: "collection is not published",
                                    id: "collectionListNotPublished"
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
                    <FormattedMessage
                      defaultMessage="No collections found"
                      id="collectionListNoCollections"
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
CollectionList.displayName = "CollectionList";
export default CollectionList;
