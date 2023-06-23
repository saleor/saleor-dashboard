// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import DeleteIconButton from "@dashboard/components/DeleteIconButton";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import Link from "@dashboard/components/Link";
import Money from "@dashboard/components/Money";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableRowLink from "@dashboard/components/TableRowLink";
import { customerUrl } from "@dashboard/customers/urls";
import GiftCardStatusChip from "@dashboard/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { PLACEHOLDER } from "@dashboard/giftCards/GiftCardUpdate/types";
import { giftCardListUrl, giftCardUrl } from "@dashboard/giftCards/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { renderCollection } from "@dashboard/misc";
import { productUrl } from "@dashboard/products/urls";
import { Card, TableBody, TableCell, Typography } from "@material-ui/core";
import { PillLink } from "@saleor/macaw-ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import GiftCardListSearchAndFilters from "../GiftCardListSearchAndFilters";
import { giftCardsListTableMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
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

  const { toggle, isSelected, giftCards, numberOfColumns, params } =
    useGiftCardList();
  const { openDeleteDialog } = useGiftCardListDialogs();

  const isCurrencySelected = !!params.currency;

  useEffect(() => {
    if (!canBeSorted(params.sort, isCurrencySelected)) {
      navigate(
        giftCardListUrl({
          ...params,
          sort: GiftCardUrlSortField.usedBy,
        }),
      );
    }
  });

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
              if (!giftCard) {
                return (
                  <>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell className={classes.skeleton} colSpan={5}>
                      <Skeleton />
                    </TableCell>
                    <TableCell className={classes.colDelete}>
                      <DeleteIconButton />
                    </TableCell>
                  </>
                );
              }

              const {
                id,
                last4CodeChars,
                usedBy,
                usedByEmail,
                tags,
                product,
                currentBalance,
              } = giftCard;

              return (
                <TableRowLink
                  href={giftCardUrl(id)}
                  className={classes.row}
                  key={id}
                  hover={!!giftCard}
                  data-test-id={"gift-card-row-" + id}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      data-test-id="select-gift-card-checkbox"
                      disabled={!giftCard}
                      disableClickPropagation
                      checked={isSelected(id)}
                      onChange={() => toggle(id)}
                    />
                  </TableCell>
                  <TableCell className={classes.colCardCode}>
                    <div className={classes.cardCodeContainer}>
                      <Typography>
                        {intl.formatMessage(messages.codeEndingWithLabel, {
                          last4CodeChars,
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
                      <TableButtonWrapper>
                        <PillLink
                          className={classes.pill}
                          component={RouterLink}
                          to={productUrl(product?.id)}
                          onClick={event => {
                            event.stopPropagation();
                            navigate(productUrl(product?.id));
                          }}
                        >
                          {product?.name}
                        </PillLink>
                      </TableButtonWrapper>
                    ) : (
                      PLACEHOLDER
                    )}
                  </TableCell>
                  <TableCell>
                    {usedBy ? (
                      <TableButtonWrapper>
                        <Link href={customerUrl(usedBy?.id)}>
                          {`${usedBy?.firstName} ${usedBy?.lastName}`}
                        </Link>
                      </TableButtonWrapper>
                    ) : (
                      <Typography noWrap>
                        {usedByEmail || PLACEHOLDER}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" className={classes.colBalance}>
                    <Money money={currentBalance} />
                  </TableCell>
                  <TableCell className={classes.colDelete}>
                    <DeleteIconButton
                      onClick={event => {
                        event.stopPropagation();
                        openDeleteDialog(id);
                      }}
                    />
                  </TableCell>
                </TableRowLink>
              );
            },
            () => (
              <TableRowLink>
                <TableCell colSpan={numberOfColumns}>
                  <FormattedMessage {...messages.noGiftCardsFound} />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};

export default GiftCardsListTable;
