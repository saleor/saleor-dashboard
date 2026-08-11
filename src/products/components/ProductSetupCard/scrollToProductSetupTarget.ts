export const productSetupScrollTargets = {
  category: '[data-test-id="category"]',
  variants: '[data-test-id="product-variants"]',
  media: '[data-test-id="product-media-gallery"]',
  seo: '[data-test-id="seo-complete"], [data-test-id="seo-incomplete"]',
  availability: '[data-test-id="availability-card"]',
} as const;

export type ProductSetupScrollTarget = keyof typeof productSetupScrollTargets;

export const scrollToProductSetupTarget = (target: ProductSetupScrollTarget): void => {
  const element = document.querySelector(productSetupScrollTargets[target]);

  element?.scrollIntoView({ behavior: "smooth", block: "center" });
};
