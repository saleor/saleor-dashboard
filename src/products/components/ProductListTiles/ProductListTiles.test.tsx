import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ProductListTiles } from "./ProductListTiles";

jest.mock("../ProductListPagination/ProductListPagination", () => ({
  ProductListPagination: (): null => null,
}));

describe("ProductListTiles", () => {
  it("uses the same empty placeholder as the list view", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <ProductListTiles
          products={[]}
          disabled={false}
          settings={{ rowNumber: 20 }}
          onTileClick={jest.fn()}
          onUpdateListSettings={jest.fn()}
        />
      </Wrapper>,
    );

    // Assert
    expect(screen.getByTestId("empty-data-grid-text")).toHaveTextContent("No products found");
  });
});
