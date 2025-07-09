import React from "react";

import { CategoryItem } from "./CategoryItem";
import { CollectionItem } from "./CollectionItem";
import { ModelItem } from "./ModelItem";
import { ModelTypeItem } from "./ModelTypeItem";
import { OrderItem } from "./OrderItem";
import { ItemData } from "./prepareResults";
import { ProductItem } from "./ProductItem";
import { VariantItem } from "./VariantItem";

export const ResultItem = ({ result }: { result: ItemData }) => {
  const { node } = result;

  if (node.__typename === "Order") {
    return <OrderItem node={node} />;
  }

  if (node.__typename === "Category") {
    return <CategoryItem node={node} />;
  }

  if (node.__typename === "Collection") {
    return <CollectionItem node={node} />;
  }

  if (node.__typename === "Product") {
    return <ProductItem node={node} />;
  }

  if (node.__typename === "ProductVariant") {
    return <VariantItem node={node} />;
  }

  if (node.__typename === "Page") {
    return <ModelItem node={node} />;
  }

  if (node.__typename === "PageType") {
    return <ModelTypeItem node={node} />;
  }

  return null;
};
