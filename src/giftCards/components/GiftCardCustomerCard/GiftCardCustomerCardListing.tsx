import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import CardMenu from "@saleor/components/CardMenu";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { makeStyles } from "@saleor/macaw-ui";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { Divider } from "@material-ui/core";
import StatusChip from "@saleor/components/StatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import { ExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { GiftCardList_giftCards_edges_node } from "@saleor/giftCards/GiftCardsList/types/GiftCardList";

interface GiftCardCustomerCardListingProps {
  giftCard: ExtendedGiftCard<GiftCardList_giftCards_edges_node>;
}

const useStyles = makeStyles(theme => ({
  listingWrapper: () => ({
    display: "grid",
    gridTemplateColumns: "max-content 1fr min-content",
    margin: `${theme.spacing(2)} ${theme.spacing(3)}`,
    alignItems: "center"
  }),
  listingMenu: {
    gridColumn: "3"
  }
}));

const GiftCardCustomerCardListing: React.FC<GiftCardCustomerCardListingProps> = ({
  giftCard
}) => {
  const intl = useIntl();
  const classes = useStyles();

  // Formated message -> reusable

  return (
    <>
      <div className={classes.listingWrapper}>
        <FormattedMessage
          defaultMessage={"Code ending with {cardNumber}"}
          values={{
            cardNumber: giftCard.displayCode.slice(
              4,
              giftCard.displayCode.length
            )
          }}
        />
        {/* <StatusChip status={StatusType.ERROR} label="Deactivated" /> */}
        <CardMenu
          className={classes.listingMenu}
          menuItems={[
            {
              label: intl.formatMessage({
                defaultMessage: "Delete",
                description: "button"
              }),
              onSelect: () => console.log("Delete")
            },
            {
              label: intl.formatMessage({
                defaultMessage: "Actiavte",
                description: "button"
              }),
              onSelect: () => console.log("Activate")
            }
          ]}
        />
      </div>
      <Divider />
    </>
  );
};

export default GiftCardCustomerCardListing;
