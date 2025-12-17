import { ProductTranslationFragment } from "@dashboard/graphql";
import { FormPayloadProductTranslate } from "@saleor/app-sdk/app-bridge";

export const createProductTranslateFormPayloadEvent = ({
  languageCode,
  productId,
  cachedProductDescription,
  cachedProductSeoDescription,
  cachedProductSeoName,
  cachedProductName,
  productData,
  translationData,
}: {
  languageCode: string;
  productId: string;
  cachedProductDescription: string;
  cachedProductName: string;
  cachedProductSeoName: string;
  cachedProductSeoDescription: string;
  productData: Exclude<ProductTranslationFragment["product"], null>;
  translationData: ProductTranslationFragment["translation"];
}): FormPayloadProductTranslate => {
  return {
    translationLanguage: languageCode,
    form: "product-translate",
    productId: productId,
    fields: {
      productName: {
        type: "short-text",
        fieldName: "productName",
        originalValue: productData.name ?? "",
        currentValue: cachedProductName ?? productData.name ?? "",
        translatedValue: translationData?.name ?? "",
      },
      productDescription: {
        currentValue: cachedProductDescription ?? productData.description ?? "",
        type: "editorjs",
        fieldName: "productDescription",
        originalValue: productData.description ?? "",
        translatedValue: translationData?.description ?? "",
      },
      seoName: {
        type: "short-text",
        fieldName: "seoName",
        originalValue: productData.seoTitle ?? "",
        currentValue: cachedProductSeoName ?? productData.seoTitle ?? "",
        translatedValue: translationData?.seoTitle ?? "",
      },
      seoDescription: {
        currentValue: cachedProductSeoDescription ?? productData.seoDescription ?? "",
        type: "long-text",
        fieldName: "seoDescription",
        originalValue: productData.seoDescription ?? "",
        translatedValue: translationData?.seoDescription ?? "",
      },
    },
  };
};
