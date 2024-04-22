import Link from "@dashboard/components/Link";
import { giftCardPath } from "@dashboard/giftCards/urls";
import { OrderDetailsFragment } from "@dashboard/graphql";
import React from "react";
import { FormattedMessage } from "react-intl";

import { orderPaymentMessages } from "../../messages";

interface OrderPaymentGiftCardsProps {
  usedGiftcards: OrderDetailsFragment["giftCards"];
}

export const OrderPaymentGiftCards = ({
  usedGiftcards,
}: OrderPaymentGiftCardsProps) => {
  return (
    <FormattedMessage
      {...orderPaymentMessages.paidWithGiftCard}
      values={{
        link: usedGiftcards.map(({ id, last4CodeChars }) => (
          <Link key={id} href={giftCardPath(id)}>
            {last4CodeChars}
          </Link>
        )),
      }}
    />
  );
};
