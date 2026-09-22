import { render, screen } from "@testing-library/react";

import {
  ProductReferenceChipLabel,
  SwatchAttributeChipLabel,
  toProductDisplayChip,
  toSwatchDisplayChip,
} from "./ReferenceChip";

describe("ProductReferenceChipLabel", () => {
  it("renders a thumbnail, truncated name, and full name in the title", () => {
    // Arrange
    render(
      <ProductReferenceChipLabel name="Apple Juice" thumbnailUrl="https://example.com/apple.png" />,
    );

    // Assert
    expect(screen.getByTestId("product-reference-chip")).toHaveAttribute("title", "Apple Juice");
    expect(screen.getByText("Apple Juice")).toBeInTheDocument();
    expect(screen.getByTestId("product-reference-thumbnail")).toHaveAttribute(
      "src",
      "https://example.com/apple.png",
    );
  });
});

describe("toProductDisplayChip", () => {
  it("keeps the option identity and attaches a chip label", () => {
    // Arrange
    const option = {
      label: "Apple Juice",
      value: "prod-1",
      slug: "apple-juice",
      productThumbnailUrl: "https://example.com/apple.png",
    };

    // Act
    const chip = toProductDisplayChip(option);

    // Assert
    expect(chip.value).toBe("prod-1");
    expect(chip.slug).toBe("apple-juice");
    expect(chip.productThumbnailUrl).toBe("https://example.com/apple.png");
    expect(chip.label).not.toBe("Apple Juice");
  });
});

describe("SwatchAttributeChipLabel", () => {
  it("renders a color swatch next to the name", () => {
    // Arrange
    render(<SwatchAttributeChipLabel name="Dark Orange" swatchColor="#c45c26" />);

    // Assert
    expect(screen.getByTestId("swatch-attribute-chip")).toHaveAttribute("title", "Dark Orange");
    expect(screen.getByText("Dark Orange")).toBeInTheDocument();
    expect(screen.getByTestId("swatch-preview")).toHaveStyle({ backgroundColor: "#c45c26" });
  });
});

describe("toSwatchDisplayChip", () => {
  it("keeps the option identity and attaches a chip label", () => {
    // Arrange
    const option = {
      label: "Dark Orange",
      value: "val-1",
      slug: "dark-orange",
      swatchColor: "#c45c26",
    };

    // Act
    const chip = toSwatchDisplayChip(option);

    // Assert
    expect(chip.value).toBe("val-1");
    expect(chip.slug).toBe("dark-orange");
    expect(chip.swatchColor).toBe("#c45c26");
    expect(chip.label).not.toBe("Dark Orange");
  });
});
