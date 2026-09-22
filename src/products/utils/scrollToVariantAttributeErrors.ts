import { scrollElementIntoDetailContent } from "@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent";
import { type ProductErrorWithAttributesFragment } from "@dashboard/graphql";

export const scrollToVariantAttributeErrors = (
  errors: ProductErrorWithAttributesFragment[],
): void => {
  const hasAttributeError = errors.some(
    error => error.field === "attributes" || (error.attributes?.length ?? 0) > 0,
  );

  if (!hasAttributeError) {
    return;
  }

  const element = document.querySelector<HTMLElement>('[data-test-id="attributes"]');

  if (element) {
    scrollElementIntoDetailContent(element);
  }
};
