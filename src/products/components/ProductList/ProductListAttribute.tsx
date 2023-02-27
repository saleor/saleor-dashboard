import Date, { DateTime } from "@dashboard/components/Date";
import Skeleton from "@dashboard/components/Skeleton";
import { ProductListAttributeFragment } from "@dashboard/graphql";
import React from "react";

import { getAttributeIdFromColumnValue } from "../ProductListPage/utils";

export interface ProductListAttributeProps {
  attribute: string;
  productAttributes: ProductListAttributeFragment[];
}

const ProductListAttribute: React.FC<ProductListAttributeProps> = ({
  attribute: gridAttribute,
  productAttributes,
}) => {
  if (!productAttributes) {
    return <Skeleton />;
  }

  const productAttribute = productAttributes.find(
    attribute => attribute.attribute.id === getAttributeIdFromColumnValue(gridAttribute),
  );
  if (productAttribute) {
    if (productAttribute.values.length) {
      if (productAttribute.values[0].date) {
        return <Date date={productAttribute.values[0].date} />;
      }
      if (productAttribute.values[0].dateTime) {
        return <DateTime date={productAttribute.values[0].dateTime} />;
      }
    }

    const textValue = productAttribute.values.map(value => value.name).join(", ");

    return <span title={textValue}>{textValue}</span>;
  }
  return <span>-</span>;
};

export default ProductListAttribute;
