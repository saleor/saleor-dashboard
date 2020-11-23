import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@saleor/components/Checkbox";
import Date from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import Percent from "@saleor/components/Percent";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TablePagination from "@saleor/components/TablePagination";
import { SaleListUrlSortField } from "@saleor/discounts/urls";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import { SaleType } from "@saleor/types/globalTypes";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage } from "react-intl";

import { SaleList_sales_edges_node } from "../../types/SaleList";

export interface SaleListProps
  extends ListProps,
    ListActions,
    SortPage<SaleListUrlSortField>,
    ChannelProps {
  sales: SaleList_sales_edges_node[];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colEnd: {
        width: 250
      },
      colName: {},
      colStart: {
        width: 250
      },
      colValue: {
        width: 200
      }
    },
    colEnd: {
      textAlign: "right"
    },
    colName: {
      paddingLeft: 0
    },
    colStart: {
      textAlign: "right"
    },
    colValue: {
      textAlign: "right"
    },
    tableRow: {
      cursor: "pointer"
    }
  }),
  { name: "SaleList" }
);

const numberOfColumns = 5;

const SaleList: React.FC<SaleListProps> = props => {
  const {
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    pageInfo,
    sales,
    selectedChannelId,
    isChecked,
    selected,
    sort,
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
        items={sales}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === SaleListUrlSortField.name
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(SaleListUrlSortField.name)}
          className={classes.colName}
        >
          <FormattedMessage defaultMessage="Name" description="sale name" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === SaleListUrlSortField.startDate
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(SaleListUrlSortField.startDate)}
          className={classes.colStart}
        >
          <FormattedMessage
            defaultMessage="Starts"
            description="sale start date"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === SaleListUrlSortField.endDate
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(SaleListUrlSortField.endDate)}
          className={classes.colEnd}
        >
          <FormattedMessage defaultMessage="Ends" description="sale end date" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === SaleListUrlSortField.value
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(SaleListUrlSortField.value)}
          className={classes.colValue}
        >
          <FormattedMessage defaultMessage="Value" description="sale value" />
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
          sales,
          sale => {
            const isSelected = sale ? isChecked(sale.id) : false;
            const channel = sale?.channelListings?.find(
              lisiting => lisiting.channel.id === selectedChannelId
            );
            return (
              <TableRow
                className={!!sale ? classes.tableRow : undefined}
                hover={!!sale}
                key={sale ? sale.id : "skeleton"}
                onClick={sale ? onRowClick(sale.id) : undefined}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(sale.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {maybe<React.ReactNode>(() => sale.name, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colStart}>
                  {sale && sale.startDate ? (
                    <Date date={sale.startDate} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colEnd}>
                  {sale && sale.endDate ? (
                    <Date date={sale.endDate} />
                  ) : sale && sale.endDate === null ? (
                    "-"
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colValue}
                  onClick={sale ? onRowClick(sale.id) : undefined}
                >
                  {sale?.type && channel?.discountValue ? (
                    sale.type === SaleType.FIXED ? (
                      <Money
                        money={{
                          amount: channel.discountValue,
                          currency: channel.currency
                        }}
                      />
                    ) : channel?.discountValue ? (
                      <Percent amount={channel.discountValue} />
                    ) : (
                      "-"
                    )
                  ) : sale && !channel ? (
                    "_"
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
                <FormattedMessage defaultMessage="No sales found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
SaleList.displayName = "SaleList";
export default SaleList;
