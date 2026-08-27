import { render, screen } from "@testing-library/react";

import { ListSearchInput } from "./ListSearchInput";

describe("ListSearchInput", () => {
  it("renders a bordered field with the placeholder", () => {
    // Arrange & Act
    render(
      <ListSearchInput
        initialSearch=""
        placeholder="Search Products..."
        onSearchChange={jest.fn()}
        showTooltip={false}
      />,
    );

    // Assert
    expect(screen.getByTestId("list-search-field")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search Products...")).toBeInTheDocument();
  });
});
