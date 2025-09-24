import { atom } from "jotai";

type TranslateProductForm = {
  formId: "translate-product";
  langauge: string;
  productId: string;
  fields: Array<{
    fieldName: string;
    fieldValue: string;
    fieldOriginal: string;
    type: "short" | "rich";
  }>;
};

export const translateProductFormStateAtom = atom<TranslateProductForm>();
