import { TableBody, TableCell, TableFooter, TableRow } from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import Date from "@saleor/components/Date";
import Money from "@saleor/components/Money";
import Percent from "@saleor/components/Percent";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import { TablePaginationWithContext } from "@saleor/components/TablePagination";
import TableRowLink from "@saleor/components/TableRowLink";
import TooltipTableCellHeader from "@saleor/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@saleor/components/TooltipTableCellHeader/messages";
import { SaleListUrlSortField, saleUrl } from "@saleor/discounts/urls";
import { canBeSorted } from "@saleor/discounts/views/SaleList/sort";
import { SaleFragment, SaleType } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import { getArrowDirection } from "@saleor/utils/sort";
import classNames from "classnames";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface SaleListProps
  extends ListProps,
    ListActions,
    SortPage<SaleListUrlSortField>,
    ChannelProps {
  sales: SaleFragment[];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colEnd: {
        width: 250,
      },
      colName: {},
      colStart: {
        width: 250,
      },
      colValue: {
        width: 200,
      },
    },
    colEnd: {
      textAlign: "right",
    },
    colName: {
      paddingLeft: 0,
    },
    colStart: {
      textAlign: "right",
    },
    colValue: {
      textAlign: "right",
    },
    tableRow: {
      cursor: "pointer",
    },
    textOverflow: {
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  }),
  { name: "SaleList" },
);

const SaleList: React.FC<SaleListProps> = props => {
  const {
    settings,
    disabled,
    onUpdateListSettings,
    onSort,
    sales,
    selectedChannelId,
    isChecked,
    selected,
    sort,
    toggle,
    toggleAll,
    toolbar,
    filterDependency,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const numberOfColumns = sales?.length === 0 ? 4 : 5;

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
          <FormattedMessage
            id="F56hOz"
            defaultMessage="Name"
            description="sale name"
          />
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
            id="iBSq6l"
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
          <FormattedMessage
            id="giF5UV"
            defaultMessage="Ends"
            description="sale end date"
          />
        </TableCellHeader>
        <TooltipTableCellHeader
          direction={
            sort.sort === SaleListUrlSortField.value
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(SaleListUrlSortField.value)}
          disabled={
            !canBeSorted(SaleListUrlSortField.value, !!selectedChannelId)
          }
          tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
            filterName: filterDependency.label,
          })}
          className={classes.colValue}
        >
          <FormattedMessage
            id="XZR590"
            defaultMessage="Value"
            description="sale value"
          />
        </TooltipTableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePaginationWithContext
            colSpan={numberOfColumns}
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
          />
        </TableRow>
      </TableFooter>
      <TableBody>
        {renderCollection(
          sales,
          sale => {
            const isSelected = sale ? isChecked(sale.id) : false;
            const channel = sale?.channelListings?.find(
              lisiting => lisiting.channel.id === selectedChannelId,
            );
            return (
              <TableRowLink
                className={!!sale ? classes.tableRow : undefined}
                hover={!!sale}
                key={sale ? sale.id : "skeleton"}
                href={sale && saleUrl(sale.id)}
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
                <TableCell
                  className={classNames(classes.colName, classes.textOverflow)}
                >
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
                <TableCell className={classes.colValue}>
                  {sale?.type && channel?.discountValue ? (
                    sale.type === SaleType.FIXED ? (
                      <Money
                        money={{
                          amount: channel.discountValue,
                          currency: channel.currency,
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
              </TableRowLink>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="51HE+Q" defaultMessage="No sales found" />
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
SaleList.displayName = "SaleList";
export default SaleList;
