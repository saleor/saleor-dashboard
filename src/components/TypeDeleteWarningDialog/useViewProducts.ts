import { productListUrlWithProductTypes } from "@dashboard/products/urls";
import { useMemo } from "react";

import { type TypeBaseData } from "./types";

export interface ProductTypeBaseData extends TypeBaseData {
  slug?: string | null;
}

interface ViewProductsProps {
  productTypeBaseData: ProductTypeBaseData[] | undefined;
}

export const useViewProducts = ({ productTypeBaseData }: ViewProductsProps) =>
  useMemo(() => productListUrlWithProductTypes(productTypeBaseData), [productTypeBaseData]);
