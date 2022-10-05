import { TableCell } from "@material-ui/core";
import DeleteIconButton from "@saleor/components/DeleteIconButton";
import TableCellHeader, {
  TableCellHeaderArrowDirection,
  TableCellHeaderProps,
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import TooltipTableCellHeader from "@saleor/components/TooltipTableCellHeader";
import { commonTooltipMessages } from "@saleor/components/TooltipTableCellHeader/messages";
import Label, {
  LabelSizes,
} from "@saleor/orders/components/OrderHistory/Label";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { messages as filterLabels } from "../../GiftCardListSearchAndFilters/filters";
import { giftCardsListTableMessages as messages } from "../../messages";
import { useGiftCardListDialogs } from "../../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../../providers/GiftCardListProvider";
import { canBeSorted } from "../../sort";
import { useTableStyles as useStyles } from "../../styles";
import { GiftCardUrlSortField } from "../../types";
import BulkEnableDisableSection from "./BulkEnableDisableSection";

interface HeaderItem {
  title?: MessageDescriptor;
  options?: TableCellHeaderProps;
  onClick?: () => void;
  direction?: TableCellHeaderArrowDirection;
}

interface GiftCardsListTableHeaderProps {
  isCurrencySelected: boolean;
}

const GiftCardsListTableHeader: React.FC<GiftCardsListTableHeaderProps> = ({
  isCurrencySelected,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    giftCards,
    numberOfColumns,
    loading,
    toggleAll,
    listElements,
  } = useGiftCardList();
  const { openDeleteDialog } = useGiftCardListDialogs();
  const { onSort, sort } = useGiftCardList();

  const getDirection = (sortField: GiftCardUrlSortField) =>
    sort.sort === sortField ? getArrowDirection(sort.asc) : undefined;

  const headerItems: HeaderItem[] = [
    {
      title: messages.giftCardsTableColumnGiftCardTitle,
      options: {
        className: classes.colCardCode,
        textAlign: "left",
      },
    },
    {
      title: messages.giftCardsTableColumnTagTitle,
    },
    {
      title: messages.giftCardsTableColumnProductTitle,
      onClick: () => onSort(GiftCardUrlSortField.product),
      direction: getDirection(GiftCardUrlSortField.product),
    },
    {
      title: messages.giftCardsTableColumnCustomerTitle,
      onClick: () => onSort(GiftCardUrlSortField.usedBy),
      direction: getDirection(GiftCardUrlSortField.usedBy),
    },
  ];

  const headerTooltipItem: HeaderItem & {
    disabled: boolean;
    tooltip: string | React.ReactNodeArray;
  } = {
    title: messages.giftCardsTableColumnBalanceTitle,
    options: {
      className: classes.colBalance,
      textAlign: "right",
    },
    onClick: () => onSort(GiftCardUrlSortField.balance),
    direction: getDirection(GiftCardUrlSortField.balance),
    disabled: !canBeSorted(GiftCardUrlSortField.balance, isCurrencySelected),
    tooltip: intl.formatMessage(commonTooltipMessages.noFilterSelected, {
      filterName: <b>{filterLabels.currencyLabel.defaultMessage}</b>,
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title, ...headerTooltipItemProps } = headerTooltipItem;

  return (
    <>
      <colgroup>
        <col />
        <col className={classes.colCardCode} />
        <col className={classes.colBase} />
        <col className={classes.colProduct} />
        <col className={classes.colBase} />
        <col className={classes.colBalance} />
        <col className={classes.colDelete} />
      </colgroup>
      <TableHead
        disabled={loading}
        colSpan={numberOfColumns}
        selected={listElements.length}
        items={giftCards}
        toggleAll={toggleAll}
        toolbar={
          <div className={classes.toolbar}>
            <BulkEnableDisableSection />
            <DeleteIconButton onClick={() => openDeleteDialog()} />
          </div>
        }
      >
        {headerItems.map(({ title, options, onClick, direction }) => (
          <TableCellHeader
            {...options}
            onClick={onClick}
            direction={direction}
            key={title.defaultMessage}
          >
            <Label text={intl.formatMessage(title)} size={LabelSizes.md} />
          </TableCellHeader>
        ))}
        <TooltipTableCellHeader {...headerTooltipItemProps}>
          <Label
            text={intl.formatMessage(headerTooltipItem.title)}
            size={LabelSizes.md}
          />
        </TooltipTableCellHeader>
        <TableCell className={classes.colDelete} />
      </TableHead>
    </>
  );
};

export default GiftCardsListTableHeader;
