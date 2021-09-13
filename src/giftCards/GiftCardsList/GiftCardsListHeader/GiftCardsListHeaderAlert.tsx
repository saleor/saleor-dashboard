import useNavigator from "@saleor/hooks/useNavigator";
import { Alert } from "@saleor/macaw-ui";
import { productAddUrl } from "@saleor/products/urls";
import { productTypeAddUrl } from "@saleor/productTypes/urls";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useGiftCardProductsCountQuery } from "../queries";
import GiftCardsListHeaderAlertContent from "./GiftCardsListHeaderAlertContent";

const GiftCardsListHeaderAlert: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    data: giftCardProductsCount,
    loading: giftCardProductsCountLoading
  } = useGiftCardProductsCountQuery();

  const giftCardProductTypesExist =
    giftCardProductsCount?.giftCardProductTypes.totalCount > 0;
  const giftCardProductsExist =
    giftCardProductsCount?.giftCardProducts.totalCount > 0;

  const showNoGiftCardProductsAlert =
    !giftCardProductsCountLoading &&
    (!giftCardProductTypesExist || !giftCardProductsExist);

  const handleCreateGiftCardProductType = () =>
    navigate(
      productTypeAddUrl({
        kind: ProductTypeKindEnum.GIFT_CARD
      })
    );

  const handleCreateGiftCardProduct = () => navigate(productAddUrl());

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
          handleCreateGiftCardProductType={handleCreateGiftCardProductType}
          handleCreateGiftCardProduct={handleCreateGiftCardProduct}
        />
      </Alert>
    );
  }

  return null;
};

export default GiftCardsListHeaderAlert;
