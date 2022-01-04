import { TableCell } from "@material-ui/core";
import DeleteIconButton from "@saleor/components/DeleteIconButton";
import TableCellHeader, {
  TableCellHeaderArrowDirection,
  TableCellHeaderProps
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import Label, {
  LabelSizes
} from "@saleor/orders/components/OrderHistory/Label";
import { getArrowDirection } from "@saleor/utils/sort";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { giftCardsListTableMessages as messages } from "../../messages";
import useGiftCardListDialogs from "../../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardListSort from "../../providers/GiftCardListDialogsProvider/hooks/useGiftCardListSort";
import useGiftCardList from "../../providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../../providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { useTableStyles as useStyles } from "../../styles";
import { GiftCardUrlSortField } from "../../types";
import BulkEnableDisableSection from "./BulkEnableDisableSection";

interface HeaderItem {
  title?: MessageDescriptor;
  options?: TableCellHeaderProps;
  onClick?: () => void;
  direction?: TableCellHeaderArrowDirection;
}

const GiftCardsListTableHeader: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});

  const { giftCards, numberOfColumns, loading } = useGiftCardList();
  const { toggleAll, listElements } = useGiftCardListBulkActions();
  const { openDeleteDialog } = useGiftCardListDialogs();
  const { onSort, sort } = useGiftCardListSort();

  const getDirection = (sortField: GiftCardUrlSortField) =>
    sort.sort === sortField ? getArrowDirection(sort.asc) : undefined;

  const headerItems: HeaderItem[] = [
    {
      title: messages.giftCardsTableColumnGiftCardTitle,
      options: {
        className: classes.colCardCode,
        textAlign: "left"
      }
    },
    {
      title: messages.giftCardsTableColumnTagTitle
    },
    {
      title: messages.giftCardsTableColumnProductTitle,
      onClick: () => onSort(GiftCardUrlSortField.product),
      direction: getDirection(GiftCardUrlSortField.product)
    },
    {
      title: messages.giftCardsTableColumnCustomerTitle,
      onClick: () => onSort(GiftCardUrlSortField.usedBy),
      direction: getDirection(GiftCardUrlSortField.usedBy)
    },
    {
      title: messages.giftCardsTableColumnBalanceTitle,
      options: {
        className: classes.colBalance,
        textAlign: "right"
      },
      onClick: () => onSort(GiftCardUrlSortField.balance),
      direction: getDirection(GiftCardUrlSortField.balance)
    }
  ];

  return (
    <>
      <colgroup>
        <col />
        <col className={classes.colCardCode} />
        <col className={classes.colBase} />
        <col className={classes.colBase} />
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
          <>
            <BulkEnableDisableSection />
            <DeleteIconButton onClick={openDeleteDialog} />
          </>
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
        <TableCell className={classes.colDelete} />
      </TableHead>
    </>
  );
};

export default GiftCardsListTableHeader;
