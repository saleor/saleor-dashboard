import { IntlShape } from "react-intl";

import messages from "./messages";
import { ProductMaterialEnum } from "./types";

export const mapProductMaterialsToOptions = (intl: IntlShape) => {
  return Object.keys(ProductMaterialEnum).map(material => ({
    label: mapProductMaterialToMessage(intl, material as ProductMaterialEnum),
    value: material,
  }));
};

export const mapProductMaterialToMessage = (intl: IntlShape, material: ProductMaterialEnum) => {
  switch (material) {
    case ProductMaterialEnum.COTTON:
      return intl.formatMessage(messages.materialCotton);
    case ProductMaterialEnum.POLYESTER:
      return intl.formatMessage(messages.materialPolyester);
    case ProductMaterialEnum.WOOL:
      return intl.formatMessage(messages.materialWool);
    case ProductMaterialEnum.NYLON:
      return intl.formatMessage(messages.materialNylon);
    default:
      throw new Error("Invalid product material");
  }
};

export const getMaterialCompositionRowId = (material: ProductMaterialEnum) =>
  `material:${material}`;
