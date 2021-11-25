import { Link, makeStyles, Typography } from "@material-ui/core";
import { Alert } from "@saleor/macaw-ui";
import { orderGiftCardBoughtPath } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardListOrderCardMessages as messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    alert: {
      marginTop: theme.spacing(2)
    }
  }),
  { name: "GiftCardsListOrderCard" }
);

const GiftCardsListOrderCard: React.FC = () => {
  const classes = useStyles();

  return (
    <Alert variant="info" close={false} className={classes.alert}>
      <Typography>
        <FormattedMessage
          {...messages.giftCardOrderMessage}
          values={{
            orderPageLink: (
              <Link href={orderGiftCardBoughtPath()}>
                View Orders with Gift Cards
              </Link>
            )
          }}
        />
      </Typography>
    </Alert>
  );
};

export default GiftCardsListOrderCard;
