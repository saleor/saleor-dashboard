import { Button, Card, CardActions, makeStyles } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage } from "react-intl";

import CustomerGiftCardsList from "./CustomerGiftCardsList";
import { useCustomerGiftCardQuery } from "./queries";

interface CustomerGiftCardsCardProps {
  customerId?: string | null;
}

interface CustomerGiftCardsCardActionsProps {
  buttonPosition: "left" | "right";
}

const useStyles = makeStyles(
  theme => ({
    cardActions: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      flexDirection: ({ buttonPosition }: CustomerGiftCardsCardActionsProps) =>
        buttonPosition === "left" ? "row" : "row-reverse"
    }
  }),
  { name: "CustomerGiftCardsCard" }
);

const CustomerGiftCardsCard: React.FC<CustomerGiftCardsCardProps> = ({
  customerId
}) => {
  const { data, loading } = useCustomerGiftCardQuery({
    variables: {
      first: 5,
      filter: {
        usedBy: [customerId]
      }
    }
  });

  const giftCards = mapEdgesToItems(data?.giftCards);

  const classes = useStyles({
    buttonPosition: giftCards?.length > 0 ? "right" : "left"
  });

  const handleViewAllButton = () => {
    // history push to filtered gift cards
  };

  const handleCreateNewCardButton = () => {
    // oepn issue new card modal
  };

  const getCardSubtitle = () =>
    !!giftCards?.length ? (
      <FormattedMessage
        defaultMessage="Only five newest gift cards are shown here"
        description="subtitle"
      />
    ) : (
      <FormattedMessage
        defaultMessage="There are no gift cards assigned to this customer"
        description="subtitle"
      />
    );

  return (
    <Card>
      <CardTitle
        title="Gift Cards"
        toolbar={
          !!giftCards?.length && (
            <Button
              variant="text"
              color="primary"
              onClick={handleViewAllButton}
            >
              <FormattedMessage
                defaultMessage="View All"
                description="button"
              />
            </Button>
          )
        }
        showHorizontalLine={!!giftCards?.length}
      >
        {getCardSubtitle()}
        <VerticalSpacer spacing={2} />
      </CardTitle>
      <CustomerGiftCardsList giftCards={giftCards} loading={loading} />
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

export default CustomerGiftCardsCard;
