import Wrapper from "@test/wrapper";
import { render, screen } from "@testing-library/react";

import { SearchForm } from "./form";

jest.mock("./useHasPermission", () => ({
  useHasPermission: () => () => true,
}));

describe("SearchForm", () => {
  it("shows search syntax hints on the main search input", () => {
    // Arrange & Act
    render(
      <SearchForm onSearchChange={jest.fn()} onScopeChange={jest.fn()} scope="all" query="" />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(screen.getByTestId("search-syntax-tooltip")).toBeInTheDocument();
  });
});
