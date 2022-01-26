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
import { customerUrl } from "@saleor/customers/urls";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { PLACEHOLDER } from "@saleor/giftCards/GiftCardUpdate/types";
import { giftCardListUrl, giftCardUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { renderCollection } from "@saleor/misc";
import { productUrl } from "@saleor/products/urls";
import React from "react";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardListSearchAndFilters from "../GiftCardListSearchAndFilters";
import { giftCardsListTableMessages as messages } from "../messages";
import useGiftCardListDialogs from "../providers/GiftCardListDialogsProvider/hooks/useGiftCardListDialogs";
import useGiftCardList from "../providers/GiftCardListProvider/hooks/useGiftCardList";
import useGiftCardListBulkActions from "../providers/GiftCardListProvider/hooks/useGiftCardListBulkActions";
import { canBeSorted } from "../sort";
import { useTableStyles as useStyles } from "../styles";
import { GiftCardUrlSortField } from "../types";
import GiftCardsListTableFooter from "./GiftCardsListTableFooter";
import GiftCardsListTableHeader from "./GiftCardsListTableHeader";
import { getTagCellText } from "./utils";

const GiftCardsListTable: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();

  const { giftCards, numberOfColumns, loading, params } = useGiftCardList();
  const { toggle, isSelected } = useGiftCardListBulkActions();
  const { openDeleteDialog } = useGiftCardListDialogs();

  const isCurrencySelected = !!params.currency;

  useEffect(() => {
    if (!canBeSorted(params.sort, isCurrencySelected)) {
      navigate(
        giftCardListUrl({
          ...params,
          sort: GiftCardUrlSortField.usedBy
        })
      );
    }
  });

  const redirectToGiftCardUpdate = (id: string) => () =>
    navigate(giftCardUrl(id));

  return (
    <Card>
      <GiftCardListSearchAndFilters />
      <ResponsiveTable>
        <GiftCardsListTableHeader isCurrencySelected={isCurrencySelected} />
        <GiftCardsListTableFooter />
        <TableBody>
          {renderCollection(
            giftCards,
            giftCard => {
              const {
                id,
                last4CodeChars,
                usedBy,
                usedByEmail,
                tags,
                product,
                currentBalance
              } = giftCard;

              return (
                <TableRow
                  onClick={redirectToGiftCardUpdate(id)}
                  className={classes.row}
                  key={id}
                  hover={!!giftCard}
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
                          last4CodeChars
                        })}
                      </Typography>
                      <>
                        <HorizontalSpacer spacing={2} />
                        <GiftCardStatusChip giftCard={giftCard} />
                      </>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography>{getTagCellText(tags)}</Typography>
                  </TableCell>
                  <TableCell>
                    {product ? (
                      <Link href={productUrl(product?.id)}>
                        {product?.name}
                      </Link>
                    ) : (
                      PLACEHOLDER
                    )}
                  </TableCell>
                  <TableCell>
                    {usedBy ? (
                      <Link href={customerUrl(usedBy?.id)}>
                        {`${usedBy?.firstName} ${usedBy?.lastName}`}
                      </Link>
                    ) : (
                      <Typography noWrap>
                        {usedByEmail || PLACEHOLDER}
                      </Typography>
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
              );
            },
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
