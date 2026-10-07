import { ProductMediaType } from "@dashboard/graphql";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { ProductMediaTranslationPreview } from "./TranslationsProductMediaPage";

describe("ProductMediaTranslationPreview", () => {
  it("uses the translated alt text for the image preview", () => {
    // Arrange // Act
    render(
      <IntlProvider locale="en" messages={{}}>
        <ProductMediaTranslationPreview
          alt="Translated front view"
          media={{
            id: "media-1",
            alt: "Front view",
            url: "https://example.com/product.jpg",
            type: ProductMediaType.IMAGE,
            oembedData: "{}",
          }}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByAltText("Translated front view")).toHaveAttribute(
      "src",
      "https://example.com/product.jpg",
    );
  });
});
