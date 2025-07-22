import React from "react";

import { CategoryItem } from "./CategoryItem";
import { CollectionItem } from "./CollectionItem";
import { ModelItem } from "./ModelItem";
import { ModelTypeItem } from "./ModelTypeItem";
import { OrderItem } from "./OrderItem";
import { ItemData } from "./prepareResults";
import { ProductItem } from "./ProductItem";
import { VariantItem } from "./VariantItem";

export const ResultItem = ({
  result,
  className,
  onClick,
}: {
  result: ItemData;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const { node } = result;

  if (node.__typename === "Order") {
    return <OrderItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "Category") {
    return <CategoryItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "Collection") {
    return <CollectionItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "Product") {
    return <ProductItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "ProductVariant") {
    return <VariantItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "Page") {
    return <ModelItem node={node} className={className} onClick={onClick} />;
  }

  if (node.__typename === "PageType") {
    return <ModelTypeItem node={node} className={className} onClick={onClick} />;
  }

  return null;
};
