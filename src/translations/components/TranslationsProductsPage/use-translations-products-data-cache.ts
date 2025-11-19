import { useRef } from "react";

type DataCacheFields = "productName" | "productDescription" | "seoDescription" | "seoName";

// A hack to access field that are currently being edited in nested form.
export const useTranslationsProductsDataCache = () => {
  const dataCache = useRef<Record<DataCacheFields, string | null>>({
    productName: null,
    productDescription: null,
    seoDescription: null,
    seoName: null,
  });

  const resetCache = (): void => {
    dataCache.current = {
      productName: null,
      productDescription: null,
      seoName: null,
      seoDescription: null,
    };
  };

  return {
    resetCache,
    cachedProductName: dataCache.current.productName,
    cachedProductDescription: dataCache.current.productDescription,
    cachedProductSeoName: dataCache.current.seoName,
    cachedProductSeoDescription: dataCache.current.seoDescription,
    setCachedFormField(key: DataCacheFields, value: string): void {
      dataCache.current[key] = value;
    },
  };
};
