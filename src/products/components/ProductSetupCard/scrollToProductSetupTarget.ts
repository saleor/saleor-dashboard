import { scrollElementIntoDetailContent } from "@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent";

export const productSetupScrollTargets = {
  category: '[data-test-id="category"]',
  variants: '[data-test-id="product-variants"]',
  media: '[data-test-id="product-media"]',
  seo: '[data-test-id="seo-form"]',
  availability: '[data-test-id="availability-card"]',
  attributes: '[data-test-id="attributes"]',
} as const;

export type ProductSetupScrollTarget = keyof typeof productSetupScrollTargets;

const expandBeforeScroll: Partial<
  Record<ProductSetupScrollTarget, { container: string; trigger: string }>
> = {
  seo: { container: '[data-test-id="seo-form"]', trigger: '[data-test-id="edit-seo"]' },
};

const scrollAlign: Partial<Record<ProductSetupScrollTarget, "end">> = {
  seo: "end",
};

const expandTargetIfCollapsed = (target: ProductSetupScrollTarget): void => {
  const expand = expandBeforeScroll[target];

  if (!expand) {
    return;
  }

  const container = document.querySelector(expand.container);

  if (container?.getAttribute("data-expanded") === "true") {
    return;
  }

  const trigger =
    container?.querySelector<HTMLElement>(expand.trigger)?.closest<HTMLElement>("button") ??
    container?.querySelector<HTMLElement>(expand.trigger);

  trigger?.click();
};

export const scrollToProductSetupTarget = (target: ProductSetupScrollTarget): void => {
  expandTargetIfCollapsed(target);

  const element = document.querySelector(productSetupScrollTargets[target]);

  if (!(element instanceof HTMLElement)) {
    return;
  }

  scrollElementIntoDetailContent(element, { align: scrollAlign[target] ?? "start" });
};
