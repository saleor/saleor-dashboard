import Link from "@dashboard/components/Link";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { productAddUrl } from "@dashboard/products/urls";
import { productTypeAddUrl } from "@dashboard/productTypes/urls";
import { sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";

interface GiftCardsListHeaderAlertContentProps {
  giftCardProductTypesExist: boolean;
  giftCardProductsExist: boolean;
}

const alertLinkClassName = sprinkles({
  fontSize: 1,
});

const GiftCardsListHeaderAlertContent: React.FC<
  GiftCardsListHeaderAlertContentProps
> = ({ giftCardProductTypesExist, giftCardProductsExist }) => {
  const giftCardProductTypeUrl = productTypeAddUrl({
    kind: ProductTypeKindEnum.GIFT_CARD,
  });

  const giftCardCreateGiftCardProductUrl = productAddUrl();

  if (!giftCardProductTypesExist) {
    return (
      <FormattedMessage
        {...messages.noGiftCardsProductTypes}
        values={{
          createGiftCardProductType: (
            <Link href={giftCardProductTypeUrl} className={alertLinkClassName}>
              <FormattedMessage {...messages.createGiftCardProductType} />
            </Link>
          ),
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
            <Link
              href={giftCardCreateGiftCardProductUrl}
              className={alertLinkClassName}
            >
              <FormattedMessage {...messages.createGiftCardProduct} />
            </Link>
          ),
        }}
      />
    );
  }

  return null;
};

export default GiftCardsListHeaderAlertContent;
