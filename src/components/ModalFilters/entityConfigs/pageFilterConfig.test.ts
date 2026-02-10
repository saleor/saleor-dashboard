import { Condition, FilterContainer, FilterElement } from "../../ConditionalFilter/FilterElement";
import { ConditionOptions } from "../../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../../ConditionalFilter/FilterElement/ConditionSelected";
import { ExpressionValue } from "../../ConditionalFilter/FilterElement/FilterElement";
import { createPageWhereQueryVariables } from "./pageFilterConfig";

describe("ModalFilters / entityConfigs / pageFilterConfig", () => {
  describe("createPageWhereQueryVariables", () => {
    it("should return empty object for empty filter container", () => {
      // Arrange
      const filters: FilterContainer = [];
      const expectedOutput = {};

      // Act
      const result = createPageWhereQueryVariables(filters);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should create correct where clause with pageTypes filter", () => {
      // Arrange
      const filters: FilterContainer = [
        new FilterElement(
          new ExpressionValue("pageTypes", "Page Types", "pageTypes"),
          new Condition(
            ConditionOptions.fromStaticElementName("pageTypes"),
            new ConditionSelected(
              [
                { label: "Blog Post", slug: "blog-post", value: "type-1" },
                { label: "Landing Page", slug: "landing-page", value: "type-2" },
              ],
              { type: "multiselect", label: "in", value: "input-1" },
              [],
              false,
            ),
            false,
          ),
          false,
        ),
      ];
      const expectedOutput = {
        pageType: {
          oneOf: ["type-1", "type-2"],
        },
      };

      // Act
      const result = createPageWhereQueryVariables(filters);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should create correct where clause with single pageType condition", () => {
      // Arrange
      const filters: FilterContainer = [
        new FilterElement(
          new ExpressionValue("pageTypes", "Page Types", "pageTypes"),
          new Condition(
            ConditionOptions.fromStaticElementName("pageTypes"),
            new ConditionSelected(
              { label: "Blog Post", slug: "blog-post", value: "type-1" },
              { type: "select", label: "is", value: "input-1" },
              [],
              false,
            ),
            false,
          ),
          false,
        ),
      ];
      const expectedOutput = {
        pageType: {
          eq: "type-1",
        },
      };

      // Act
      const result = createPageWhereQueryVariables(filters);

      // Assert
      expect(result).toEqual(expectedOutput);
    });
  });
});
