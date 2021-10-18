import {
  Card,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import Checkbox from "@saleor/components/Checkbox";
import DeleteIconButton from "@saleor/components/DeleteIconButton";
import Link from "@saleor/components/Link";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import StatusChip from "@saleor/components/StatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import { customerUrl } from "@saleor/customers/urls";
import { PLACEHOLDER } from "@saleor/giftCards/GiftCardUpdate/types";
import { giftCardUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { renderCollection } from "@saleor/misc";
import { productUrl } from "@saleor/products/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardUpdatePageHeaderMessages as giftCardStatusChipMessages } from "../../GiftCardUpdate/GiftCardUpdatePageHeader/messages";
import GiftCardListSearchAndFilters from "../GiftCardListSearchAndFilters";
import { giftCardsListTableMessages as messages } from "../messages";
import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "../providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { useTableStyles as useStyles } from "../styles";
import GiftCardsListTableFooter from "./GiftCardsListTableFooter";
import GiftCardsListTableHeader from "./GiftCardsListTableHeader";

const GiftCardsListTable: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();

  const { giftCards, numberOfColumns, loading } = useGiftCardList();
  const { toggle, isSelected } = useGiftCardListBulkActions();
  const { openDeleteDialog } = useGiftCardListDialogs();

  const redirectToGiftCardUpdate = (id: string) => () =>
    navigate(giftCardUrl(id));

  const selectGiftCardStatusChip = ({
    isActive,
    isExpired
  }: {
    isActive: boolean;
    isExpired: boolean;
  }) => {
    if (isExpired) {
      return (
        <StatusChip
          size="md"
          status={StatusType.NEUTRAL}
          label={intl.formatMessage(
            giftCardStatusChipMessages.expiredStatusLabel
          )}
        />
      );
    }

    if (!isActive) {
      return (
        <StatusChip
          size="md"
          status={StatusType.ERROR}
          label={intl.formatMessage(
            giftCardStatusChipMessages.disabledStatusLabel
          )}
        />
      );
    }
  };

  return (
    <Card>
      <GiftCardListSearchAndFilters />
      <ResponsiveTable>
        <GiftCardsListTableHeader />
        <GiftCardsListTableFooter />
        <TableBody>
          {renderCollection(
            giftCards,
            ({
              id,
              displayCode,
              usedBy,
              usedByEmail,
              tag,
              isActive,
              product,
              currentBalance,
              isExpired
            }) => (
              <TableRow
                onClick={redirectToGiftCardUpdate(id)}
                className={classes.row}
                key={id}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    disableClickPropagation
                    checked={isSelected(id)}
                    onChange={() => toggle(id)}
                  />
                </TableCell>
                <TableCell className={classes.colCardCode}>
                  <div className={classes.cardCodeContainer}>
                    <Typography>
                      {intl.formatMessage(messages.codeEndingWithLabel, {
                        displayCode
                      })}
                    </Typography>
                    <>
                      <HorizontalSpacer spacing={2} />
                      {selectGiftCardStatusChip({ isActive, isExpired })}
                    </>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography>{tag || PLACEHOLDER}</Typography>
                </TableCell>
                <TableCell>
                  {product ? (
                    <Link onClick={() => navigate(productUrl(product?.id))}>
                      {product?.name}
                    </Link>
                  ) : (
                    PLACEHOLDER
                  )}
                </TableCell>
                <TableCell>
                  {usedBy ? (
                    <Link onClick={() => navigate(customerUrl(usedBy?.id))}>
                      {`${usedBy?.firstName} ${usedBy?.lastName}`}
                    </Link>
                  ) : (
                    <Typography noWrap>{usedByEmail || PLACEHOLDER}</Typography>
                  )}
                </TableCell>
                <TableCell align="right" className={classes.colBalance}>
                  <div className={classes.moneyContainer}>
                    <Typography variant="caption">
                      {currentBalance.currency}
                    </Typography>
                    <HorizontalSpacer spacing={0.5} />
                    <Typography>{currentBalance.amount}</Typography>
                  </div>
                </TableCell>
                <TableCell className={classes.colDelete}>
                  <DeleteIconButton
                    onClick={event => {
                      event.stopPropagation();
                      openDeleteDialog(id);
                    }}
                  />
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={numberOfColumns}>
                  <Skeleton>
                    {!loading && (
                      <FormattedMessage {...messages.noGiftCardsFound} />
                    )}
                  </Skeleton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

export default GiftCardsListTable;
