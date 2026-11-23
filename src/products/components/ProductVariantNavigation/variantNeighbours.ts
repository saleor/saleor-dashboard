import { type ProductVariantSibling } from "@dashboard/products/hooks/useProductVariantSiblings";

interface VariantNeighboursInput {
  /** Loaded variants in the product's order, starting from its first variant. */
  variants: ProductVariantSibling[];
  currentId: string | undefined;
  /** A search narrows `variants`, so a place in it says nothing about the whole product. */
  isFiltered: boolean;
}

interface VariantNeighbours {
  /** 1-based place of the current variant among the product's variants; null when unknown. */
  position: number | null;
  previousId: string | null;
  nextId: string | null;
  /** The current variant is the last one loaded: a next one may exist on a page not loaded yet. */
  isLastLoaded: boolean;
}

const unknown: VariantNeighbours = {
  position: null,
  previousId: null,
  nextId: null,
  isLastLoaded: false,
};

/**
 * Where the open variant sits among its siblings, and which variants come before and after it.
 * Unknown while the variant is outside the loaded pages or the list is filtered by a search.
 */
export const getVariantNeighbours = ({
  variants,
  currentId,
  isFiltered,
}: VariantNeighboursInput): VariantNeighbours => {
  if (!currentId || isFiltered) {
    return unknown;
  }

  const index = variants.findIndex(variant => variant.id === currentId);

  if (index === -1) {
    return unknown;
  }

  return {
    position: index + 1,
    previousId: variants[index - 1]?.id ?? null,
    nextId: variants[index + 1]?.id ?? null,
    isLastLoaded: index === variants.length - 1,
  };
};
