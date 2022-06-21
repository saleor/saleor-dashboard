import { ProductTypeKindEnum } from "@saleor/graphql";
import { isInEnum } from "@saleor/misc";
import { IntlShape } from "react-intl";

import { productKindMessages as messages } from "./messages";

interface ProductKindChoice {
  label: string;
  value: ProductTypeKindEnum;
}

export const getAvailableProductKinds = (): ProductKindChoice[] =>
  Object.keys(ProductTypeKindEnum).map(kind => ({
    label: kind,
    value: kind as ProductTypeKindEnum,
  }));

export const getProductKindOpts = (
  availableProducts: ProductKindChoice[],
  intl: IntlShape,
): ProductKindChoice[] =>
  availableProducts.map(kind => {
    switch (kind.value) {
      case ProductTypeKindEnum.GIFT_CARD:
        return {
          ...kind,
          label: intl.formatMessage(messages.giftCardLabel),
        };
      case ProductTypeKindEnum.NORMAL:
        return {
          ...kind,
          label: intl.formatMessage(messages.normalLabel),
        };
    }
  });

export const getProductGiftCardFilterParam = (productKind?: string) => {
  if (
    productKind === undefined ||
    !isInEnum(productKind, ProductTypeKindEnum)
  ) {
    return null;
  }

  return productKind === ProductTypeKindEnum.GIFT_CARD;
};
