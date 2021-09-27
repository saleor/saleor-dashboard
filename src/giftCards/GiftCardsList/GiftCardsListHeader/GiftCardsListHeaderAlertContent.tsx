import Link from "@saleor/components/Link";
import React from "react";
import { FormattedMessage } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useHeaderStyles as useStyles } from "../styles";

interface GiftCardsListHeaderAlertContentProps {
  giftCardProductTypesExist: boolean;
  giftCardProductsExist: boolean;
  handleCreateGiftCardProductType: () => void;
  handleCreateGiftCardProduct: () => void;
}

const GiftCardsListHeaderAlertContent: React.FC<GiftCardsListHeaderAlertContentProps> = ({
  giftCardProductTypesExist,
  giftCardProductsExist,
  handleCreateGiftCardProductType,
  handleCreateGiftCardProduct
}) => {
  const classes = useStyles({});

  if (!giftCardProductTypesExist) {
    return (
      <FormattedMessage
        {...messages.noGiftCardsProductTypes}
        values={{
          createGiftCardProductType: (
            <Link
              onClick={handleCreateGiftCardProductType}
              className={classes.alertLink}
            >
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
            <Link
              onClick={handleCreateGiftCardProduct}
              className={classes.alertLink}
            >
              <FormattedMessage {...messages.createGiftCardProduct} />
            </Link>
          )
        }}
      />
    );
  }

  return null;
};

export default GiftCardsListHeaderAlertContent;
