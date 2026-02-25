import Link from "@dashboard/components/Link";
import { giftCardPath } from "@dashboard/giftCards/urls";
import { type OrderDetailsFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { showComma } from "./utils";

interface OrderUsedGiftCardsProps {
  giftCards: OrderDetailsFragment["giftCardsApplied"];
}

export const OrderUsedGiftCards = ({ giftCards }: OrderUsedGiftCardsProps) => {
  return (
    <FormattedMessage
      {...messages.usedGiftCard}
      values={{
        link: giftCards.map(({ giftCard }, index) => {
          const hasComma = showComma(giftCards.length, index);

          return (
            <Link key={giftCard.id} href={giftCardPath(giftCard.id)}>
              <Box as="span" marginRight={hasComma ? 1 : 0}>
                {giftCard.last4CodeChars}
                {hasComma && ", "}
              </Box>
            </Link>
          );
        }),
      }}
    />
  );
};
