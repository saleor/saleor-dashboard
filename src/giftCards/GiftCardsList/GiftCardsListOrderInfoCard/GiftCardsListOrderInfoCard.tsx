import { Link, Typography } from "@material-ui/core";
import { Alert } from "@saleor/macaw-ui";
import { orderGiftCardBoughtPath } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardListOrderCardMessages as messages } from "./messages";

const GiftCardsListOrderInfoCard: React.FC = () => (
  <Alert variant="info" close={false}>
    <Typography>
      <FormattedMessage {...messages.giftCardOrderInfoMessage} />
      <Link href={orderGiftCardBoughtPath()}>
        <FormattedMessage {...messages.giftCardOrderInfoMessageLink} />
      </Link>
    </Typography>
  </Alert>
);

export default GiftCardsListOrderInfoCard;
