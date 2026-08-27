import { render, screen } from "@testing-library/react";

import { ProductReferenceChipLabel, toProductDisplayChip } from "./ReferenceChip";

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
