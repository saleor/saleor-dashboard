import { AttributeEntityTypeEnum } from "@dashboard/graphql";

export type VariantReferenceFields = {
  productName: string;
  variantName: string;
  productId?: string;
  productThumbnailUrl?: string;
};

export const isVariantReferenceEntity = (entityType?: string | null): boolean =>
  entityType === AttributeEntityTypeEnum.PRODUCT_VARIANT;

export const isProductReferenceEntity = (entityType?: string | null): boolean =>
  entityType === AttributeEntityTypeEnum.PRODUCT;

export const normalizeVariantReferenceProductName = (name: string): string =>
  name.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase();

export const resolveVariantReferenceFields = <
  T extends {
    label?: string;
    productName?: string;
    variantName?: string;
    productId?: string;
    productThumbnailUrl?: string;
  },
>(
  option: T,
): (T & VariantReferenceFields) | null => {
  const productName = option.productName?.trim();
  const variantName = option.variantName?.trim();

  if (productName && variantName) {
    return {
      ...option,
      productName,
      variantName,
      productId: option.productId,
      productThumbnailUrl: option.productThumbnailUrl,
    };
  }

  const [labelProduct, labelVariant] = option.label?.split("\n") ?? [];
  const parsedProduct = labelProduct?.trim();
  const parsedVariant = labelVariant?.trim();

  if (parsedProduct && parsedVariant) {
    return {
      ...option,
      productName: parsedProduct,
      variantName: parsedVariant,
      productId: option.productId,
      productThumbnailUrl: option.productThumbnailUrl,
    };
  }

  return null;
};

export const isVariantReferenceOption = <
  T extends {
    label?: string;
    productName?: string;
    variantName?: string;
    productId?: string;
    productThumbnailUrl?: string;
  },
>(
  option: T,
): option is T & VariantReferenceFields => resolveVariantReferenceFields(option) !== null;

/** Product on the first line, variant on the second — selected pills. */
export const formatVariantReferencePillLabel = (
  variantName: string,
  productName?: string,
): string => {
  const variant = variantName.trim();
  const product = productName?.trim();

  if (product && variant) {
    return `${product}\n${variant}`;
  }

  return variant || product || "";
};

export const compareVariantReferenceNames = (
  a: { productName: string; variantName: string },
  b: { productName: string; variantName: string },
): number => {
  const product = a.productName.localeCompare(b.productName, undefined, { sensitivity: "base" });

  if (product !== 0) {
    return product;
  }

  return a.variantName.localeCompare(b.variantName, undefined, { sensitivity: "base" });
};

export const getVariantReferenceGroupKey = (option: VariantReferenceFields): string =>
  option.productId || normalizeVariantReferenceProductName(option.productName);

export type VariantReferenceGroup<T extends VariantReferenceFields> = {
  productName: string;
  productId?: string;
  productThumbnailUrl?: string;
  variants: T[];
};

export const getVariantReferenceGroups = <T extends VariantReferenceFields>(
  options: T[],
): Array<VariantReferenceGroup<T>> => {
  const groups = new Map<string, VariantReferenceGroup<T>>();

  [...options].sort(compareVariantReferenceNames).forEach(option => {
    const key = getVariantReferenceGroupKey(option);
    const existing = groups.get(key);

    if (existing) {
      existing.variants.push(option);

      if (!existing.productThumbnailUrl && option.productThumbnailUrl) {
        existing.productThumbnailUrl = option.productThumbnailUrl;
      }

      return;
    }

    groups.set(key, {
      productName: option.productName,
      productId: option.productId,
      productThumbnailUrl: option.productThumbnailUrl,
      variants: [option],
    });
  });

  return [...groups.values()].map(group => ({
    ...group,
    variants: [...group.variants].sort((a, b) =>
      a.variantName.localeCompare(b.variantName, undefined, { sensitivity: "base" }),
    ),
  }));
};

export const toVariantReferencePill = <
  T extends {
    label: string;
    value?: string;
    slug?: string;
    productName?: string;
    variantName?: string;
    productId?: string;
    productThumbnailUrl?: string;
  },
>(
  option: T,
): T => {
  const fields = resolveVariantReferenceFields(option);

  if (!fields) {
    return option;
  }

  return {
    ...option,
    ...fields,
    slug: option.slug || option.value,
    label: formatVariantReferencePillLabel(fields.variantName, fields.productName),
  };
};

export const filterProductReferenceOptions = <T extends { label: string }>(
  options: T[],
  query: string,
): T[] => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter(option => option.label.toLowerCase().includes(normalized));
};

export const filterVariantReferenceOptions = <T extends VariantReferenceFields>(
  options: T[],
  query: string,
): T[] => {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return options;
  }

  return options.filter(
    option =>
      option.productName.toLowerCase().includes(normalized) ||
      option.variantName.toLowerCase().includes(normalized),
  );
};
