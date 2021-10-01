import { Divider } from "@material-ui/core";
import CardMenu, { CardMenuItem } from "@saleor/components/CardMenu";
import { giftCardsListTableMessages } from "@saleor/giftCards/GiftCardsList/messages";
import useGiftCardActivationDeactivation from "@saleor/giftCards/GiftCardUpdate/GiftCardUpdatePageHeader/hooks/useGiftCardActivationDeactivation";
import { ExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { makeStyles } from "@saleor/macaw-ui";
import * as React from "react";
import { useState } from "react";
import { useIntl } from "react-intl";

import GiftCardDeleteDialogContent from "../GiftCardDeleteDialog/GiftCardDeleteDialogContent";
import useGiftCardSingleDelete from "../GiftCardDeleteDialog/useGiftCardSingleDelete";
import GiftCardStatusChip from "../GiftCardStatusChip/GiftCardStatusChip";
import { CUSTOMER_GIFT_CARD_LIST_QUERY } from "./queries";
import { CustomerGiftCardList_giftCards_edges_node } from "./types/CustomerGiftCardList";
import { getGiftCardDisplayCode } from "./utils";

interface CustomerGiftCardsCardListCardProps {
  giftCard: ExtendedGiftCard<CustomerGiftCardList_giftCards_edges_node>;
}

const useStyles = makeStyles(
  theme => ({
    listingWrapper: () => ({
      display: "grid",
      gridTemplateColumns: "max-content 1fr min-content",
      margin: `${theme.spacing(2)} ${theme.spacing(3)}`,
      alignItems: "center",
      justifyItems: "center"
    }),
    listingMenu: {
      gridColumn: "3"
    }
  }),
  { name: "CustomerGiftCardListCard" }
);

const CustomerGiftCardsCardListCard: React.FC<CustomerGiftCardsCardListCardProps> = ({
  giftCard
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const [, setIsLoading] = useState(false);
  const [openDeleteGiftCard, setOpenDeleteGiftCard] = useState(false);
  const { isExpired, isActive } = giftCard;

  const handleActionCompleted = () => setIsLoading(false);
  const onGiftCardDeleteDialogClose = () => setOpenDeleteGiftCard(false);

  const {
    giftCardActivate,
    giftCardDeactivate
  } = useGiftCardActivationDeactivation({
    onActivateActionComplete: handleActionCompleted,
    onDeactivateActionComplete: handleActionCompleted,
    isActive
  });

  const handleGiftCardActivate = () => {
    setIsLoading(true);
    giftCardActivate({
      variables: {
        id: giftCard.id
      }
    });
  };

  const handleGiftCardDeactivate = () => {
    setIsLoading(true);
    giftCardDeactivate({
      variables: {
        id: giftCard.id
      }
    });
  };

  const handleGiftCardDelete = () => setOpenDeleteGiftCard(true);

  const getMenuItems = (): CardMenuItem[] => {
    const items = [
      {
        label: intl.formatMessage({
          defaultMessage: "Delete",
          description: "button"
        }),
        onSelect: handleGiftCardDelete
      }
    ];

    if (!isExpired) {
      const statusButton = isActive
        ? {
            label: intl.formatMessage({
              defaultMessage: "Deactivate",
              description: "button"
            }),
            onSelect: handleGiftCardDeactivate
          }
        : {
            label: intl.formatMessage({
              defaultMessage: "Activate",
              description: "button"
            }),
            onSelect: handleGiftCardActivate
          };

      items.push(statusButton);
    }

    return items;
  };

  const title = intl.formatMessage(
    giftCardsListTableMessages.codeEndingWithLabel,
    {
      displayCode: getGiftCardDisplayCode(giftCard)
    }
  );

  const { onDeleteGiftCard, deleteGiftCardOpts } = useGiftCardSingleDelete({
    id: giftCard?.id,
    onClose: onGiftCardDeleteDialogClose,
    refetchQueries: [CUSTOMER_GIFT_CARD_LIST_QUERY]
  });

  return (
    <>
      <div className={classes.listingWrapper}>
        {title}
        <GiftCardStatusChip giftCard={giftCard} />
        <CardMenu className={classes.listingMenu} menuItems={getMenuItems()} />
      </div>
      <Divider />
      <GiftCardDeleteDialogContent
        singleDeletion
        giftCard={giftCard as any}
        open={openDeleteGiftCard}
        onClose={onGiftCardDeleteDialogClose}
        onConfirm={onDeleteGiftCard}
        confirmButtonState={deleteGiftCardOpts?.status}
      />
    </>
  );
};

export default CustomerGiftCardsCardListCard;
