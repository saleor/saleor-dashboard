import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { FormattedMessage } from "react-intl";

interface GiftCardCustomerCardProps {}

const GiftCardCustomerCard: React.FC<GiftCardCustomerCardProps> = ({}) => {
  const handleViewAllButton = () => {
    // history push to filtered gift cards
    console.log("Handle view all button");
  };

  const handleCreateNewCardButton = () => {
    console.log("Handle new card");
  };

  return (
    <Card>
      <CardTitle
        title="Gift Cards"
        toolbar={
          <Button variant="text" color="primary" onClick={handleViewAllButton}>
            <FormattedMessage defaultMessage="View All" description="button" />
          </Button>
        }
      />
      <CardContent>
        <div>UwuuuuU</div>
      </CardContent>
      <CardContent>
        <div>UwuuuuU</div>
      </CardContent>
      <Divider />
      <CardActions>
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
