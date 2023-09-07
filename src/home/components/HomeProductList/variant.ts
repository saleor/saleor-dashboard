import { ProductTopToday } from "@dashboard/home/types";

export const generateAttributesInfo = (variant: ProductTopToday[number]) =>
  variant.attributes
    .filter(attribute => attribute.values.length > 0)
    .map(attribute => attribute.values[0].name)
    .join(" / ");
