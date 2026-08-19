import { v4 as uuidv4 } from "uuid";

import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type FormData } from "./types";

export const generateDraftVoucherCode = (code: string) => {
  return {
    code,
    status: "Draft",
  };
};

export const generateMultipleVoucherCodes = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() =>
    generateDraftVoucherCode(prefix ? `${prefix}-${uuidv4()}` : uuidv4()),
  );
};

export const voucherCodeExists = (code: string, voucherCodes: VoucherCode[]) => {
  return voucherCodes.some(voucherCode => voucherCode.code === code);
};

export const getAssignedVariantIdsFromForm = (data: Pick<FormData, "variants">): string[] =>
  data.variants.map(variant => variant.id);

export const mapLocalVariantsToSavedVariants = (variants: FormData["variants"]) => {
  return {
    __typename: "ProductVariantCountableConnection",
    edges: variants.map(variant => ({
      node: {
        __typename: "ProductVariant",
        id: variant.id,
        name: variant.name,
        product: {
          __typename: "Product",
          id: variant.product.id,
          name: variant.product.name,
          thumbnail: variant.product.thumbnail,
          productType: {
            __typename: "ProductType",
            id: variant.product.productType.id,
            name: variant.product.productType.name,
          },
        },
      },
    })),
  };
};
