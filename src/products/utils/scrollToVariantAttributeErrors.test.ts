import { scrollElementIntoDetailContent } from "@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent";
import { ProductErrorCode, type ProductErrorWithAttributesFragment } from "@dashboard/graphql";

import { scrollToVariantAttributeErrors } from "./scrollToVariantAttributeErrors";

jest.mock("@dashboard/components/Layouts/Detail/scrollElementIntoDetailContent", () => ({
  scrollElementIntoDetailContent: jest.fn(),
}));

describe("scrollToVariantAttributeErrors", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("scrolls the attributes card into the content pane when an attribute error is present", () => {
    // Arrange
    const attributesCard = document.createElement("div");

    attributesCard.setAttribute("data-test-id", "attributes");
    document.body.appendChild(attributesCard);

    const errors: ProductErrorWithAttributesFragment[] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "attributes",
        message: "This field cannot be blank",
        attributes: ["attr-color"],
      },
    ];

    // Act
    scrollToVariantAttributeErrors(errors);

    // Assert
    expect(scrollElementIntoDetailContent).toHaveBeenCalledWith(attributesCard);
  });

  it("does not scroll when there are no attribute errors", () => {
    // Arrange
    const attributesCard = document.createElement("div");

    attributesCard.setAttribute("data-test-id", "attributes");
    document.body.appendChild(attributesCard);

    const errors: ProductErrorWithAttributesFragment[] = [
      {
        __typename: "ProductError",
        code: ProductErrorCode.REQUIRED,
        field: "sku",
        message: "This field cannot be blank",
        attributes: [],
      },
    ];

    // Act
    scrollToVariantAttributeErrors(errors);

    // Assert
    expect(scrollElementIntoDetailContent).not.toHaveBeenCalled();
  });
});
