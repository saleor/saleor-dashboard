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
import { VoucherListUrlSortField } from "@saleor/discounts/urls";
import { maybe, renderCollection } from "@saleor/misc";
import { ChannelProps, ListActions, ListProps, SortPage } from "@saleor/types";
import { DiscountValueTypeEnum } from "@saleor/types/globalTypes";
import { getArrowDirection } from "@saleor/utils/sort";
import { getFooterColSpanWithBulkActions } from "@saleor/utils/tables";
import React from "react";
import { FormattedMessage } from "react-intl";

import { VoucherList_vouchers_edges_node } from "../../types/VoucherList";

export interface VoucherListProps
  extends ListProps,
    ListActions,
    SortPage<VoucherListUrlSortField>,
    ChannelProps {
  vouchers: VoucherList_vouchers_edges_node[];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colEnd: {
        width: 180
      },
      colMinSpent: {
        width: 150
      },
      colName: {},
      colStart: {
        width: 180
      },
      colUses: {
        width: 150
      },
      colValue: {
        width: 150
      }
    },
    colEnd: {
      textAlign: "right"
    },
    colMinSpent: {
      textAlign: "right"
    },
    colName: {
      paddingLeft: 0
    },
    colStart: {
      textAlign: "right"
    },
    colUses: {
      textAlign: "right"
    },
    colValue: {
      textAlign: "right"
    },
    tableRow: {
      cursor: "pointer"
    },
    textRight: {
      textAlign: "right"
    }
  }),
  { name: "VoucherList" }
);

const numberOfColumns = 6;

const VoucherList: React.FC<VoucherListProps> = props => {
  const {
    settings,
    disabled,
    onNextPage,
    onPreviousPage,
    onUpdateListSettings,
    onRowClick,
    onSort,
    pageInfo,
    vouchers,
    isChecked,
    selected,
    selectedChannelId,
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
        items={vouchers}
        toggleAll={toggleAll}
        toolbar={toolbar}
      >
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.code
              ? getArrowDirection(sort.asc)
              : undefined
          }
          arrowPosition="right"
          onClick={() => onSort(VoucherListUrlSortField.code)}
          className={classes.colName}
        >
          <FormattedMessage defaultMessage="Code" description="voucher code" />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.minSpent
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.minSpent)}
          className={classes.colMinSpent}
        >
          <FormattedMessage
            defaultMessage="Min. Spent"
            description="minimum amount of spent money to activate voucher"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.startDate
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.startDate)}
          className={classes.colStart}
        >
          <FormattedMessage
            defaultMessage="Starts"
            description="voucher is active from date"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.endDate
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.endDate)}
          className={classes.colEnd}
        >
          <FormattedMessage
            defaultMessage="Ends"
            description="voucher is active until date"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.value
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.value)}
          className={classes.colValue}
        >
          <FormattedMessage
            defaultMessage="Value"
            description="voucher value"
          />
        </TableCellHeader>
        <TableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.limit
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.limit)}
          className={classes.colUses}
        >
          <FormattedMessage defaultMessage="Uses" description="voucher uses" />
        </TableCellHeader>
      </TableHead>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={getFooterColSpanWithBulkActions(vouchers, numberOfColumns)}
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
          vouchers,
          voucher => {
            const isSelected = voucher ? isChecked(voucher.id) : false;
            const channel = voucher?.channelListings?.find(
              listing => listing.channel.id === selectedChannelId
            );
            const hasChannelsLoaded = voucher?.channelListings?.length;

            return (
              <TableRow
                className={!!voucher ? classes.tableRow : undefined}
                hover={!!voucher}
                key={voucher ? voucher.id : "skeleton"}
                selected={isSelected}
                onClick={voucher ? onRowClick(voucher.id) : undefined}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(voucher.id)}
                  />
                </TableCell>
                <TableCell className={classes.colName}>
                  {maybe<React.ReactNode>(() => voucher.code, <Skeleton />)}
                </TableCell>
                <TableCell className={classes.colMinSpent}>
                  {voucher?.code ? (
                    hasChannelsLoaded ? (
                      <Money money={channel?.minSpent} />
                    ) : (
                      "-"
                    )
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colStart}>
                  {voucher?.startDate ? (
                    <Date date={voucher.startDate} />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colEnd}>
                  {voucher?.endDate ? (
                    <Date date={voucher.endDate} />
                  ) : voucher && voucher.endDate === null ? (
                    "-"
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell
                  className={classes.colValue}
                  onClick={voucher ? onRowClick(voucher.id) : undefined}
                >
                  {voucher?.code ? (
                    hasChannelsLoaded ? (
                      voucher.discountValueType ===
                      DiscountValueTypeEnum.FIXED ? (
                        <Money
                          money={
                            channel?.discountValue && {
                              amount: channel?.discountValue,
                              currency: channel?.currency
                            }
                          }
                        />
                      ) : (
                        <Percent amount={channel?.discountValue} />
                      )
                    ) : (
                      "-"
                    )
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colUses}>
                  {maybe<React.ReactNode>(
                    () =>
                      voucher.usageLimit === null ? "-" : voucher.usageLimit,
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            );
          },
          () => (
            <TableRow>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage defaultMessage="No vouchers found" />
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
VoucherList.displayName = "VoucherList";
export default VoucherList;
