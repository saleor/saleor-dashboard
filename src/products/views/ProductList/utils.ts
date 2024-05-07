import { FilterValueProvider } from "@dashboard/components/ConditionalFilter/FilterValueProvider";
import { ProductTypeKindEnum } from "@dashboard/graphql";
import { isInEnum } from "@dashboard/misc";
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
      default:
        return kind;
    }
  });

export const getProductGiftCardFilterParam = (productKind?: string) => {
  if (productKind === undefined || !isInEnum(productKind, ProductTypeKindEnum)) {
    return null;
  }

  return productKind === ProductTypeKindEnum.GIFT_CARD;
};

export const getNextUniqueTabName = (name: string, avialabeNames: string[]) => {
  let uniqueName = name;
  let i = 1;

  while (avialabeNames.includes(uniqueName)) {
    uniqueName = `${name} ${i}`;
    i++;
  }

  return uniqueName;
};

export const getActiveTabIndexAfterTabDelete = (
  currentTab: number,
  tabIndexToDelete: number,
): string => (tabIndexToDelete < currentTab ? `${currentTab - 1}` : `${currentTab}`);

export const obtainChannelFromFilter = (valueProvider: FilterValueProvider) => {
  const channelToken = valueProvider.getTokenByName("channel");

  if (channelToken) {
    return channelToken.value;
  }
};
