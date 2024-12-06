// @ts-strict-ignore
import { products } from "@dashboard/products/fixtures";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductTile } from "./ProductTile";

describe("ProductTile", () => {
  const PLACEHOLDER_URL =
    "https://master.staging.saleor.cloud/media/thumbnails/products/saleordemoproduct_fd_juice_02_thumbnail_256.png";
  const mockProduct = (withThumbnail: boolean) =>
    withThumbnail ? products(PLACEHOLDER_URL)[0] : { ...products(null)[0], thumbnail: null };

  it("renders correctly with thumbnail", () => {
    // Arrange
    const product = mockProduct(true);

    // Act
    render(
      <ThemeProvider>
        <ProductTile product={product} onClick={jest.fn()} />
      </ThemeProvider>,
    );

    // Assert
    const img = screen.getByAltText(product.name);

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", PLACEHOLDER_URL);
    expect(screen.getByText(product.productType.name)).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });
  it("renders correctly without thumbnail", () => {
    // Arrange
    const product = mockProduct(false);

    // Act
    render(
      <ThemeProvider>
        <ProductTile product={product} onClick={jest.fn()} />
      </ThemeProvider>,
    );
    // Assert
    expect(screen.getByTestId(`placeholder-svg-${product.id}`)).toBeInTheDocument();
    expect(screen.getByText(product.productType.name)).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });
  it("fires onClick when clicked", async () => {
    // Arrange
    const product = mockProduct(null);
    const onClick = jest.fn();
    const user = userEvent.setup();

    // Act
    render(
      <ThemeProvider>
        <ProductTile product={product} onClick={onClick} />
      </ThemeProvider>,
    );
    await user.click(screen.getByTestId(`product-tile-${product.id}`));
    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
