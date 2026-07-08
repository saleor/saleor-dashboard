import { Condition } from "./FilterElement/Condition";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { Constraint, GLOBAL } from "./FilterElement/Constraint";
import {
  ExpressionValue,
  type FilterContainer,
  FilterElement,
} from "./FilterElement/FilterElement";
import {
  getEditableFilterContainer,
  hasGlobalConstraints,
  stripGlobalConstraints,
} from "./globalConstraints";

const createGlobalProductTypeElement = (): FilterElement => {
  const element = new FilterElement(
    new ExpressionValue("productType", "ProductType", "productType"),
    new Condition(
      ConditionOptions.fromStaticElementName("productType"),
      new ConditionSelected(
        { label: "in", slug: "in", value: "input-2" },
        { type: "multiselect", value: "input-2", label: "in" },
        [],
        false,
      ),
      false,
    ),
    false,
  );

  element.setConstraint(new Constraint(GLOBAL, ["left", "right", "condition"], false));

  return element;
};

const createPriceElement = (): FilterElement =>
  new FilterElement(
    new ExpressionValue("price", "Price", "price"),
    new Condition(
      ConditionOptions.fromStaticElementName("price"),
      new ConditionSelected(
        { label: "is", slug: "is", value: "input-1" },
        { type: "price", value: "100", label: "100" },
        [],
        false,
      ),
      false,
    ),
    false,
  );

describe("globalConstraints", () => {
  describe("hasGlobalConstraints", () => {
    it("returns true when a global constraint row exists", () => {
      // Assert
      expect(hasGlobalConstraints([createGlobalProductTypeElement()])).toBe(true);
    });

    it("returns false for user-only filters", () => {
      // Assert
      expect(hasGlobalConstraints([createPriceElement()])).toBe(false);
    });
  });

  describe("stripGlobalConstraints", () => {
    it("removes the locked row and orphaned AND separator", () => {
      // Arrange
      const priceElement = createPriceElement();
      const filterValue: FilterContainer = [createGlobalProductTypeElement(), "AND", priceElement];

      // Act
      const result = stripGlobalConstraints(filterValue);

      // Assert
      expect(result).toEqual([priceElement]);
    });
  });

  describe("getEditableFilterContainer", () => {
    it("returns only user filters when global constraints are present", () => {
      // Arrange
      const priceElement = createPriceElement();
      const filterValue: FilterContainer = [createGlobalProductTypeElement(), "AND", priceElement];

      // Act
      const result = getEditableFilterContainer(filterValue);

      // Assert
      expect(result).toEqual([priceElement]);
    });

    it("returns the original container when no global constraints exist", () => {
      // Arrange
      const filterValue: FilterContainer = [createPriceElement()];

      // Act
      const result = getEditableFilterContainer(filterValue);

      // Assert
      expect(result).toEqual(filterValue);
    });
  });
});
