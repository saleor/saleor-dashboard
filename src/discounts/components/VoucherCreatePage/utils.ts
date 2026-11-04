import {
  type CategoryWithTotalProductsFragment,
  type CollectionWithTotalProductsFragment,
  type SearchProductFragment,
  type VoucherCatalogueFragment,
} from "@dashboard/graphql";

import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type FormData, VoucherCreatePageTab } from "./types";

export const generateDraftVoucherCode = (code: string) => {
  return {
    code,
    status: "Draft",
  };
};

export const generateMultipleVoucherCodes = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() =>
    generateDraftVoucherCode(prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID()),
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

type CreateCatalogueAssignments = Pick<
  FormData,
  "categories" | "collections" | "products" | "variants"
>;

interface CreateCatalogueLists {
  categories: CategoryWithTotalProductsFragment[];
  collections: CollectionWithTotalProductsFragment[];
  products: SearchProductFragment[];
  variants: VoucherCatalogueFragment["variants"];
}

/**
 * The create page paginates only the open catalogue group. Slice that group's own typed list to
 * the current page and give the collapsed groups nothing, so an item is never read as another
 * type (mapping a category as a variant crashed the page).
 */
export const getCreateCatalogueLists = ({
  activeTab,
  assignments,
  pageRange,
}: {
  activeTab: VoucherCreatePageTab;
  assignments: CreateCatalogueAssignments;
  /** Current page as `slice` bounds: `start` inclusive, `end` exclusive. */
  pageRange: { start: number; end: number };
}): CreateCatalogueLists => {
  const isOpen = (tab: VoucherCreatePageTab): boolean => activeTab === tab;
  const currentPage = <T>(items: T[]): T[] => items.slice(pageRange.start, pageRange.end);

  return {
    categories: isOpen(VoucherCreatePageTab.categories) ? currentPage(assignments.categories) : [],
    collections: isOpen(VoucherCreatePageTab.collections)
      ? currentPage(assignments.collections)
      : [],
    products: isOpen(VoucherCreatePageTab.products) ? currentPage(assignments.products) : [],
    // The list component reads a voucher catalogue connection; local variants only fill the
    // fields it renders, so this cast stays until DiscountVariants accepts plain rows.
    variants: isOpen(VoucherCreatePageTab.variants)
      ? (mapLocalVariantsToSavedVariants(
          currentPage(assignments.variants),
        ) as unknown as VoucherCatalogueFragment["variants"])
      : null,
  };
};
