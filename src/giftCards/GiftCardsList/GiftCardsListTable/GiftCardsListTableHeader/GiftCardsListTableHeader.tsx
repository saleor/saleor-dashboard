import { TableCell } from "@material-ui/core";
import DeleteIconButton from "@saleor/components/DeleteIconButton";
import TableCellHeader, {
  TableCellHeaderProps
} from "@saleor/components/TableCellHeader";
import TableHead from "@saleor/components/TableHead";
import Label, {
  LabelSizes
} from "@saleor/orders/components/OrderHistory/Label";
import React from "react";
import { MessageDescriptor, useIntl } from "react-intl";

import { giftCardsListTableMessages as messages } from "../../messages";
import useGiftCardListDialogs from "../../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "../../providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../../providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { useTableStyles as useStyles } from "../../styles";
import BulkEnableDisableSection from "./BulkEnableDisableSection";

interface HeaderItem {
  title?: MessageDescriptor;
  options?: TableCellHeaderProps;
}

const GiftCardsListTableHeader: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});

  const { giftCards, numberOfColumns, loading } = useGiftCardList();
  const { toggleAll, listElements } = useGiftCardListBulkActions();
  const { openDeleteDialog } = useGiftCardListDialogs();

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
      title: messages.giftCardsTableColumnProductTitle
    },
    {
      title: messages.giftCardsTableColumnCustomerTitle
    },
    {
      title: messages.giftCardsTableColumnBalanceTitle,
      options: {
        className: classes.colBalance,
        textAlign: "right"
      }
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
        {headerItems.map(({ title, options }) => (
          <TableCellHeader {...options}>
            <Label text={intl.formatMessage(title)} size={LabelSizes.md} />
          </TableCellHeader>
        ))}
        <TableCell className={classes.colDelete} />
      </TableHead>
    </>
  );
};

export default GiftCardsListTableHeader;
