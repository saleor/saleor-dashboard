import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { ProductListViewSwitch } from "./ProductListViewSwitch";

describe("ProductListViewSwitch", () => {
  it("sets title and aria-label on list and grid buttons", () => {
    // Arrange & Act
    render(
      <Wrapper>
        <ProductListViewSwitch defaultValue="datagrid" setProductListViewType={jest.fn()} />
      </Wrapper>,
    );

    // Assert
    const listViewButton = screen.getByTestId("datagrid-view-button");
    const gridViewButton = screen.getByTestId("tile-view-button");

    expect(listViewButton).toHaveAttribute("title", "List view");
    expect(listViewButton).toHaveAttribute("aria-label", "List view");
    expect(gridViewButton).toHaveAttribute("title", "Grid view");
    expect(gridViewButton).toHaveAttribute("aria-label", "Grid view");
  });
});
