import { useActiveAppExtension } from "@dashboard/extensions/components/AppExtensionContext/AppExtensionContextProvider";
import { ProductTranslationFragment } from "@dashboard/graphql";
import { TranslationInputFieldName } from "@dashboard/translations/types";
import { useEffect, useRef } from "react";

/**
 * React on app response and emit dirty fields change
 */
export const useTranslationProductFormAppResponse = ({
  cachedProductName,
  cachedProductSeoDescription,
  cachedProductSeoName,
  onEdit,
  productData,
  cachedProductDescription,
}: {
  cachedProductName?: string;
  cachedProductDescription?: string;
  cachedProductSeoDescription?: string;
  cachedProductSeoName?: string;
  productData: ProductTranslationFragment["product"];
  onEdit(fields: TranslationInputFieldName[]): void;
}) => {
  const { framesByFormType } = useActiveAppExtension();
  // To reset editor.js we set unique resetKey everytime app responds. This can be replaced to event emitted date.
  const resetKey = useRef(Date.now());

  const extensionResponseFrames = framesByFormType["product-translate"];

  const lastFrame = extensionResponseFrames
    ? extensionResponseFrames[extensionResponseFrames.length - 1]
    : null;

  useEffect(() => {
    if (!lastFrame || !productData) {
      return;
    }

    const { productName, productDescription, seoDescription, seoName } = lastFrame.fields;

    const dirtyFields: TranslationInputFieldName[] = [];

    if (productName?.value !== (cachedProductName ?? productData?.name)) {
      dirtyFields.push(TranslationInputFieldName.name);
    }

    if (productDescription?.value !== (cachedProductDescription ?? productData.description)) {
      dirtyFields.push(TranslationInputFieldName.description);
    }

    if (seoDescription?.value !== (cachedProductSeoDescription ?? productData?.seoDescription)) {
      dirtyFields.push(TranslationInputFieldName.seoDescription);
    }

    if (seoName?.value !== (cachedProductSeoName ?? productData?.seoTitle)) {
      dirtyFields.push(TranslationInputFieldName.seoTitle);
    }

    onEdit(dirtyFields);

    resetKey.current = Date.now();
  }, [
    cachedProductDescription,
    cachedProductName,
    cachedProductSeoDescription,
    cachedProductSeoName,
    lastFrame,
    onEdit,
    productData,
  ]);

  return {
    resetKey,
    appResponseFields: {
      productName: lastFrame?.fields.productName?.value,
      productDescription: lastFrame?.fields.productDescription?.value,
      seoDescription: lastFrame?.fields.seoDescription?.value,
      seoName: lastFrame?.fields.seoName?.value,
    },
  };
};
