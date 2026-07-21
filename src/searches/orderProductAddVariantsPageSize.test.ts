import { SearchOrderVariantDocument } from "@dashboard/graphql";
import { ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE } from "@dashboard/searches/useOrderVariantSearch";
import { print } from "graphql";

describe("ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE", () => {
  it("matches the SearchOrderVariant document page size", () => {
    // Arrange // Act
    const document = print(SearchOrderVariantDocument);

    // Assert — codegen embeds a literal; keep it aligned with the shared constant
    expect(document).toContain(`productVariants(first: ${ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE})`);
    expect(ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE).toBeGreaterThanOrEqual(50);
  });
});
