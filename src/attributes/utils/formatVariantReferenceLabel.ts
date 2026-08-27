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
