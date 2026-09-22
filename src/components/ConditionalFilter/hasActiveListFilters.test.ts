import { Condition } from "@dashboard/components/ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import {
  type FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { ExpressionValue } from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { createProductExportQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { AttributeInputTypeEnum } from "@dashboard/graphql";

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

  it("returns true when a NUMERIC attribute filter is present", () => {
    // Arrange
    const filterContainer: FilterContainer = [
      new FilterElement(
        new ExpressionValue("attribute", "Attribute", "attribute"),
        new Condition(
          ConditionOptions.fromName(AttributeInputTypeEnum.NUMERIC),
          ConditionSelected.fromConditionItemAndValue(
            { type: "number.range", label: "between", value: "input-4" },
            ["120", "300"],
          ),
          false,
        ),
        false,
        undefined,
        new ExpressionValue("fabric-weight-gsm", "Fabric weight", AttributeInputTypeEnum.NUMERIC),
      ),
    ];

    // Act
    const result = hasActiveListFilters({
      filterContainer,
      createFilterVariables,
    });

    // Assert
    expect(result).toBe(true);
  });
});
