import { FormChange } from "@saleor/hooks/useForm";
import { ProductTypeKindEnum } from "@saleor/types/globalTypes";

import { ProductTypeAddUrlKindEnum } from "./urls";

export const makeProductTypeKindChangeHanlder = (
  onChange: FormChange,
  onKindChange: (kind: ProductTypeKindEnum) => void
) => (event: React.ChangeEvent<any>) => {
  const kind = event.target.value as ProductTypeKindEnum;
  onKindChange(kind);
  onChange(event);
};

export const mapProductTypeKindToQueryParam = (
  kind: ProductTypeKindEnum
): ProductTypeAddUrlKindEnum => {
  switch (kind) {
    case ProductTypeKindEnum.NORMAL:
      return ProductTypeAddUrlKindEnum.normal;
    case ProductTypeKindEnum.GIFT_CARD:
      return ProductTypeAddUrlKindEnum.giftCard;
    default:
      return ProductTypeAddUrlKindEnum.normal;
  }
};

export const mapProductTypeKindFromQueryParam = (
  kind: ProductTypeAddUrlKindEnum
): ProductTypeKindEnum => {
  switch (kind) {
    case ProductTypeAddUrlKindEnum.normal:
      return ProductTypeKindEnum.NORMAL;
    case ProductTypeAddUrlKindEnum.giftCard:
      return ProductTypeKindEnum.GIFT_CARD;
    default:
      return ProductTypeKindEnum.NORMAL;
  }
};
