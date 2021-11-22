import { ProductTypeKindEnum } from "@saleor/types/globalTypes";

interface ProductKindChoice {
  label: string;
  value: ProductTypeKindEnum;
}

export const getAvailableProductKinds = (): ProductKindChoice[] =>
  Object.keys(ProductTypeKindEnum).map(kind => ({
    label: kind,
    value: kind as ProductTypeKindEnum
  }));

export const getProductKindOpts = (
  availableProducts: ProductKindChoice[]
): ProductKindChoice[] =>
  availableProducts.map(kind => {
    switch (kind.value) {
      case ProductTypeKindEnum.GIFT_CARD:
        return {
          ...kind,
          label: "Gift Card"
        };
      case ProductTypeKindEnum.NORMAL:
        return {
          ...kind,
          label: "Normal"
        };
    }
  });
