/** Same shape as saved variant-reference attribute values (`Product: Variant`). */
export const formatVariantReferenceLabel = (productName: string, variantName: string): string => {
  const product = productName.trim();
  const variant = variantName.trim();

  if (!variant) {
    return product;
  }

  if (!product) {
    return variant;
  }

  return `${product}: ${variant}`;
};

/** Inverse of `formatVariantReferenceLabel` for labels saved as `Product: Variant`. */
export const splitVariantReferenceLabel = (
  label: string,
): { productName: string; variantName: string } | null => {
  const separator = label.indexOf(": ");

  if (separator <= 0) {
    return null;
  }

  const productName = label.slice(0, separator).trim();
  const variantName = label.slice(separator + 2).trim();

  if (!productName || !variantName) {
    return null;
  }

  return { productName, variantName };
};

/** First-line parts: variant is primary, parent product is secondary. */
export const getVariantReferenceLine = ({
  label,
  caption,
  primary,
}: {
  label: string;
  caption?: string | null;
  primary?: string | null;
}): { variantName: string; productName?: string } => {
  if (primary?.trim()) {
    return {
      variantName: primary.trim(),
      productName: caption?.trim() || undefined,
    };
  }

  const split = splitVariantReferenceLabel(label);

  if (split) {
    return {
      variantName: split.variantName,
      productName: caption?.trim() || split.productName,
    };
  }

  return {
    variantName: label,
    productName: caption?.trim() || undefined,
  };
};
