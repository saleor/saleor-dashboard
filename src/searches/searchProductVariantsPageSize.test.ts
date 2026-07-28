import { SEARCH_PRODUCT_VARIANTS_PAGE_SIZE } from "@dashboard/fragments/products";
import { SearchProductsDocument } from "@dashboard/graphql";
import { print } from "graphql";

describe("SEARCH_PRODUCT_VARIANTS_PAGE_SIZE", () => {
  it("matches the SearchProducts document page size", () => {
    // Arrange // Act
    const document = print(SearchProductsDocument);

    // Assert — codegen embeds a literal; keep it aligned with the shared constant
    expect(document).toContain(`productVariants(first: ${SEARCH_PRODUCT_VARIANTS_PAGE_SIZE})`);
    // Embed size must stay low: SearchProducts multiplies this by products.first.
    expect(SEARCH_PRODUCT_VARIANTS_PAGE_SIZE).toBe(20);
  });

  it("declares includeVariants as optional Boolean with default (Cloud rejects Boolean! =)", () => {
    // Arrange // Act
    const document = print(SearchProductsDocument);

    // Assert — Non-Null + default is invalid; Saleor Cloud returns HTTP 400
    expect(document).toContain("$includeVariants: Boolean = false");
    expect(document).not.toContain("$includeVariants: Boolean! = false");
  });
});
