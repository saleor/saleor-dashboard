import { ApplyFormFields, FormContextTranslateProduct } from "@saleor/app-sdk/app-bridge";
import { atom } from "jotai";

export const translateProductFormStateAtom = atom<FormContextTranslateProduct>();

export const translateProductFromAppResponseAtom = atom<ApplyFormFields["payload"]["fields"]>();
