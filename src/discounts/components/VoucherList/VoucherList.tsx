// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import Date from "@dashboard/components/Date";
import Money from "@dashboard/components/Money";
import Percent from "@dashboard/components/Percent";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableHead from "@dashboard/components/TableHead";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import TooltipTableCellHeader from "@dashboard/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@dashboard/components/TooltipTableCellHeader/messages";
import { VoucherListUrlSortField, voucherUrl } from "@dashboard/discounts/urls";
import { canBeSorted } from "@dashboard/discounts/views/VoucherList/sort";
import { DiscountValueTypeEnum, VoucherFragment } from "@dashboard/graphql";
import { maybe, renderCollection } from "@dashboard/misc";
import {
  ChannelProps,
  ListActions,
  ListProps,
  SortPage,
} from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableBody, TableCell, TableFooter } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface VoucherListProps
  extends ListProps,
    ListActions,
    SortPage<VoucherListUrlSortField>,
    ChannelProps {
  vouchers: VoucherFragment[];
}

const useStyles = makeStyles(
  theme => ({
    [theme.breakpoints.up("lg")]: {
      colEnd: {
        width: 180,
      },
      colMinSpent: {
        width: 150,
      },
      colName: {},
      colStart: {
        width: 180,
      },
      colUses: {
        width: 150,
      },
      colValue: {
        width: 150,
      },
    },
    colEnd: {
      textAlign: "right",
    },
    colMinSpent: {
      textAlign: "right",
    },
    colName: {
      paddingLeft: 0,
    },
    colStart: {
      textAlign: "right",
    },
    colUses: {
      textAlign: "right",
    },
    colValue: {
      textAlign: "right",
    },
    tableRow: {
      cursor: "pointer",
    },
    textRight: {
      textAlign: "right",
    },
    textOverflow: {
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  }),
  { name: "VoucherList" },
);

const numberOfColumns = 7;

const VoucherList: React.FC<VoucherListProps> = props => {
  const {
    settings,
    disabled,
    onUpdateListSettings,
    onSort,
    vouchers,
    isChecked,
    selected,
    selectedChannelId,
    sort,
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
          <FormattedMessage
            id="JsPIOX"
            defaultMessage="Code"
            description="voucher code"
          />
        </TableCellHeader>
        <TooltipTableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.minSpent
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.minSpent)}
          disabled={
            !canBeSorted(VoucherListUrlSortField.minSpent, !!selectedChannelId)
          }
          className={classes.colMinSpent}
          tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
            filterName: filterDependency.label,
          })}
        >
          <FormattedMessage
            id="tuYPlG"
            defaultMessage="Min. Spent"
            description="minimum amount of spent money to activate voucher"
          />
        </TooltipTableCellHeader>
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
            id="5u7b3V"
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
            id="b6L9n7"
            defaultMessage="Ends"
            description="voucher is active until date"
          />
        </TableCellHeader>
        <TooltipTableCellHeader
          direction={
            sort.sort === VoucherListUrlSortField.value
              ? getArrowDirection(sort.asc)
              : undefined
          }
          textAlign="right"
          onClick={() => onSort(VoucherListUrlSortField.value)}
          disabled={
            !canBeSorted(VoucherListUrlSortField.minSpent, !!selectedChannelId)
          }
          className={classes.colValue}
          tooltip={intl.formatMessage(commonTooltipMessages.noFilterSelected, {
            filterName: filterDependency.label,
          })}
        >
          <FormattedMessage
            id="JV+EiM"
            defaultMessage="Value"
            description="voucher value"
          />
        </TooltipTableCellHeader>
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
          <FormattedMessage
            id="yHwvLL"
            defaultMessage="Uses"
            description="voucher uses"
          />
        </TableCellHeader>
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
          vouchers,
          voucher => {
            const isSelected = voucher ? isChecked(voucher.id) : false;
            const channel = voucher?.channelListings?.find(
              listing => listing.channel.id === selectedChannelId,
            );
            const hasChannelsLoaded = voucher?.channelListings?.length;

            return (
              <TableRowLink
                className={!!voucher ? classes.tableRow : undefined}
                hover={!!voucher}
                key={voucher ? voucher.id : "skeleton"}
                selected={isSelected}
                href={voucher && voucherUrl(voucher.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    disabled={disabled}
                    disableClickPropagation
                    onChange={() => toggle(voucher.id)}
                  />
                </TableCell>
                <TableCell
                  className={clsx(classes.colName, classes.textOverflow)}
                >
                  {voucher?.code ?? <Skeleton />}
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
                    <Date date={voucher.startDate} plain />
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colEnd}>
                  {voucher?.endDate ? (
                    <Date date={voucher.endDate} plain />
                  ) : voucher && voucher.endDate === null ? (
                    "-"
                  ) : (
                    <Skeleton />
                  )}
                </TableCell>
                <TableCell className={classes.colValue}>
                  {voucher?.code ? (
                    hasChannelsLoaded ? (
                      voucher.discountValueType ===
                      DiscountValueTypeEnum.FIXED ? (
                        <Money
                          money={
                            channel?.discountValue && {
                              amount: channel?.discountValue,
                              currency: channel?.currency,
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
                    <Skeleton />,
                  )}
                </TableCell>
              </TableRowLink>
            );
          },
          () => (
            <TableRowLink>
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage
                  id="U2mOqA"
                  defaultMessage="No vouchers found"
                />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};
VoucherList.displayName = "VoucherList";
export default VoucherList;
