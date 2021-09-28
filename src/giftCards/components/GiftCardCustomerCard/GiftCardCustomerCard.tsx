import { Button, Card, CardActions, makeStyles } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { parse as parseQs } from "qs";
import { GiftCardsListProvider } from "@saleor/giftCards/GiftCardsList/providers/GiftCardListProvider";
import { GiftCardListUrlQueryParams } from "@saleor/giftCards/GiftCardsList/types";
import React from "react";
import { FormattedMessage } from "react-intl";
import GiftCardCustomerCardsList from "./GiftCardCustomerCardsList";

interface GiftCardCustomerCardProps {}

interface GiftCardCustomerCardActionsProps {
  buttonPosition: "left" | "right";
}

const useStyles = makeStyles(theme => ({
  cardActions: {
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    flexDirection: ({ buttonPosition }: GiftCardCustomerCardActionsProps) =>
      buttonPosition === "left" ? "row" : "row-reverse"
  }
}));

const GiftCardCustomerCard: React.FC<GiftCardCustomerCardProps> = ({}) => {
  const classes = useStyles({ buttonPosition: "right" });

  const handleViewAllButton = () => {
    // history push to filtered gift cards
    console.log("Handle view all button");
  };

  const handleCreateNewCardButton = () => {
    console.log("Handle new card");
  };

  const qs = parseQs(location.search.substr(1));
  const params: GiftCardListUrlQueryParams = qs;

  return (
    <Card>
      <CardTitle
        title="Gift Cards"
        subtitle="Only five newest gift cards are shown here"
        toolbar={
          <Button variant="text" color="primary" onClick={handleViewAllButton}>
            <FormattedMessage defaultMessage="View All" description="button" />
          </Button>
        }
        showHorizontalLine={true}
      >
        <FormattedMessage
          defaultMessage="Only five newest gift cards are shown here"
          description="subtitle"
        />
        <VerticalSpacer spacing={2} />
      </CardTitle>
      <GiftCardsListProvider params={params}>
        <GiftCardCustomerCardsList />
      </GiftCardsListProvider>
      <CardActions className={classes.cardActions}>
        <Button
          variant="text"
          color="primary"
          onClick={handleCreateNewCardButton}
        >
          <FormattedMessage
            defaultMessage="Issue new card"
            description="button"
          />
        </Button>
      </CardActions>
    </Card>
  );
};

export default GiftCardCustomerCard;
