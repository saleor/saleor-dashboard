import { Button, Card, CardActions, makeStyles } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage } from "react-intl";

import GiftCardCustomerCardsList from "./GiftCardCustomerCardsList";
import { useCustomerGiftCardQuery } from "./queries";

interface GiftCardCustomerCardProps {
  customerId?: string | null;
}

interface GiftCardCustomerCardActionsProps {
  buttonPosition: "left" | "right";
}

const useStyles = makeStyles(
  theme => ({
    cardActions: {
      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
      flexDirection: ({ buttonPosition }: GiftCardCustomerCardActionsProps) =>
        buttonPosition === "left" ? "row" : "row-reverse"
    }
  }),
  { name: "GiftCardCustomerCard" }
);

const GiftCardCustomerCard: React.FC<GiftCardCustomerCardProps> = ({
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
      <GiftCardCustomerCardsList giftCards={giftCards} loading={loading} />
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
