import { type FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import { createProductExportQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";

import { hasActiveListFilters } from "./hasActiveListFilters";

const createFilterVariables = createProductExportQueryVariables;

describe("hasActiveListFilters", () => {
  it("returns false when filter container is empty and search is blank", () => {
    // Arrange
    const filterContainer: FilterContainer = [];

    // Act
    const result = hasActiveListFilters({
      filterContainer,
      searchQuery: "",
      createFilterVariables,
    });

    // Assert
    expect(result).toBe(false);
  });

  it("returns true when search query is present", () => {
    // Arrange
    const filterContainer: FilterContainer = [];

    // Act
    const result = hasActiveListFilters({
      filterContainer,
      searchQuery: "  shoes  ",
      createFilterVariables,
    });

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when conditional filters are present", () => {
    // Arrange
    const filterContainer: FilterContainer = [];
    const createFilterVariablesWithResults = () => ({ categories: ["cat-id"] });

    // Act
    const result = hasActiveListFilters({
      filterContainer,
      createFilterVariables: createFilterVariablesWithResults,
    });

    // Assert
    expect(result).toBe(true);
  });
});
