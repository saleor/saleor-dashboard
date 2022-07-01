import { useGiftCardProductsCountQuery } from "@saleor/graphql";
import { Alert } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import GiftCardsListHeaderAlertContent from "./GiftCardsListHeaderAlertContent";

const GiftCardsListHeaderAlert: React.FC = () => {
  const intl = useIntl();

  const {
    data: giftCardProductsCount,
    loading: giftCardProductsCountLoading,
  } = useGiftCardProductsCountQuery();

  const giftCardProductTypesExist =
    giftCardProductsCount?.giftCardProductTypes.totalCount > 0;
  const giftCardProductsExist =
    giftCardProductsCount?.giftCardProducts.totalCount > 0;

  const showNoGiftCardProductsAlert =
    !giftCardProductsCountLoading &&
    (!giftCardProductTypesExist || !giftCardProductsExist);

  if (showNoGiftCardProductsAlert) {
    return (
      <Alert
        title={intl.formatMessage(messages.noGiftCardsAlertTitle)}
        variant="warning"
        close={false}
      >
        <GiftCardsListHeaderAlertContent
          giftCardProductTypesExist={giftCardProductTypesExist}
          giftCardProductsExist={giftCardProductsExist}
        />
      </Alert>
    );
  }

  return null;
};

export default GiftCardsListHeaderAlert;
