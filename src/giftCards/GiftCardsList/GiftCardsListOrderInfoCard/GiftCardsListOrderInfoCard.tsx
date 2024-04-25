import Link from "@dashboard/components/Link";
import { orderGiftCardBoughtPath } from "@dashboard/orders/urls";
import { Alert } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardListOrderCardMessages as messages } from "./messages";

const GiftCardsListOrderInfoCard: React.FC = () => (
  <Alert variant="info" close={false}>
    <Text size={3}>
      <FormattedMessage
        {...messages.giftCardOrderInfoMessage}
        values={{
          link: content => <Link href={orderGiftCardBoughtPath()}>{content}</Link>,
        }}
      />
    </Text>
  </Alert>
);

export default GiftCardsListOrderInfoCard;
