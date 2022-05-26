import { Typography } from "@material-ui/core";
import Link from "@saleor/components/Link";
import { Alert } from "@saleor/macaw-ui";
import { orderGiftCardBoughtPath } from "@saleor/orders/urls";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardListOrderCardMessages as messages } from "./messages";

const GiftCardsListOrderInfoCard: React.FC = () => (
  <Alert variant="info" close={false}>
    <Typography>
      <FormattedMessage
        {...messages.giftCardOrderInfoMessage}
        values={{
          link: content => (
            <Link href={orderGiftCardBoughtPath()}>{content}</Link>
          ),
        }}
      />
    </Typography>
  </Alert>
);

export default GiftCardsListOrderInfoCard;
