import Link from "@saleor/components/Link";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";

interface GiftCardsListHeaderNotificationContentProps {
  giftCardProductTypesExist: boolean;
  giftCardProductsExist: boolean;
  handleCreateGiftCardProductType: () => void;
  handleCreateGiftCardProduct: () => void;
}

const GiftCardsListHeaderNotificationContent: React.FC<GiftCardsListHeaderNotificationContentProps> = ({
  giftCardProductTypesExist,
  giftCardProductsExist,
  handleCreateGiftCardProductType,
  handleCreateGiftCardProduct
}) => {
  if (!giftCardProductTypesExist && !giftCardProductsExist) {
    return (
      <FormattedMessage
        {...messages.noGiftCardsProductsAndProductTypes}
        values={{
          createGiftCardProductType: (
            <Link onClick={handleCreateGiftCardProductType}>
              <FormattedMessage {...messages.createGiftCardProductType} />
            </Link>
          ),
          giftCardProduct: (
            <Link onClick={handleCreateGiftCardProduct}>
              <FormattedMessage {...messages.giftCardProduct} />
            </Link>
          )
        }}
      />
    );
  }

  if (!giftCardProductTypesExist) {
    return (
      <FormattedMessage
        {...messages.noGiftCardsProductTypes}
        values={{
          createGiftCardProductType: (
            <Link onClick={handleCreateGiftCardProductType}>
              <FormattedMessage {...messages.createGiftCardProductType} />
            </Link>
          )
        }}
      />
    );
  }

  if (!giftCardProductsExist) {
    return (
      <FormattedMessage
        {...messages.noGiftCardsProducts}
        values={{
          createGiftCardProduct: (
            <Link onClick={handleCreateGiftCardProduct}>
              <FormattedMessage {...messages.createGiftCardProduct} />
            </Link>
          )
        }}
      />
    );
  }
};

export default GiftCardsListHeaderNotificationContent;
