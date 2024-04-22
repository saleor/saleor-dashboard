import Link from "@dashboard/components/Link";
import { giftCardPath } from "@dashboard/giftCards/urls";
import { OrderDetailsFragment } from "@dashboard/graphql";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface OrderUsedGiftCardsProps {
  giftCards: OrderDetailsFragment["giftCards"];
}

export const OrderUsedGiftCards = ({ giftCards }: OrderUsedGiftCardsProps) => {
  return (
    <FormattedMessage
      {...messages.usedGiftCard}
      values={{
        link: giftCards.map(({ id, last4CodeChars }) => (
          <Link key={id} href={giftCardPath(id)}>
            {last4CodeChars}
          </Link>
        )),
      }}
    />
  );
};
