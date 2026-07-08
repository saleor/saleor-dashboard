import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../ConditionalFilter/FilterElement/FilterElement";
import { type FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import {
  createOperandExclusionApiProvider,
  createOperandExclusionValueProvider,
  createOperandValueExclusions,
  stripExcludedOperandValues,
} from "./operandExclusions";

const createCollectionFilterElement = (
  collections: Array<{ label: string; value: string; slug: string }>,
) => {
  const inCondition = { type: "multiselect" as const, label: "in", value: "input-4" };

  return new FilterElement(
    new ExpressionValue("collection", "Collection", "collection"),
    new Condition(
      ConditionOptions.fromStaticElementName("collection"),
      ConditionSelected.fromConditionItemAndValue(inCondition, collections),
      false,
    ),
    false,
  );
};

describe("ModalFilters / operandExclusions", () => {
  describe("createOperandValueExclusions", () => {
    it("should return undefined when no collections are excluded", () => {
      // Arrange
      // Act
      const result = createOperandValueExclusions(undefined);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should map excluded collections to operand ids", () => {
      // Arrange
      const excludeCollections = [{ id: "col-1", name: "Featured" }];

      // Act
      const result = createOperandValueExclusions(excludeCollections);

      // Assert
      expect(result).toEqual({ collection: ["col-1"] });
    });
  });

  describe("stripExcludedOperandValues", () => {
    it("should remove the current collection from a collection filter", () => {
      // Arrange
      const currentCollection = {
        label: "Featured",
        value: "col-featured",
        slug: "featured",
      };
      const otherCollection = {
        label: "Summer",
        value: "col-summer",
        slug: "summer",
      };
      const filterContainer = [createCollectionFilterElement([currentCollection, otherCollection])];

      // Act
      const result = stripExcludedOperandValues(filterContainer, {
        collection: ["col-featured"],
      });

      // Assert
      const element = result[0];

      expect(FilterElement.isFilterElement(element)).toBe(true);

      if (FilterElement.isFilterElement(element)) {
        expect(element.condition.selected.value).toEqual([otherCollection]);
      }
    });

    it("should clear the filter when only the excluded collection was selected", () => {
      // Arrange
      const currentCollection = {
        label: "Featured",
        value: "col-featured",
        slug: "featured",
      };
      const filterContainer = [createCollectionFilterElement([currentCollection])];

      // Act
      const result = stripExcludedOperandValues(filterContainer, {
        collection: ["col-featured"],
      });

      // Assert
      const element = result[0];

      expect(FilterElement.isFilterElement(element)).toBe(true);

      if (FilterElement.isFilterElement(element)) {
        expect(element.condition.selected.value).toEqual([]);
      }
    });
  });

  describe("createOperandExclusionApiProvider", () => {
    it("should hide excluded collections from collection filter options", async () => {
      // Arrange
      const baseProvider = {
        fetchRightOptions: jest.fn().mockResolvedValue([
          { label: "Featured", value: "col-featured", slug: "featured" },
          { label: "Summer", value: "col-summer", slug: "summer" },
        ]),
        fetchAttributeOptions: jest.fn(),
      };
      const provider = createOperandExclusionApiProvider(baseProvider, {
        collection: ["col-featured"],
      });
      const filterContainer = [createCollectionFilterElement([])];

      // Act
      const options = await provider.fetchRightOptions("0", filterContainer, "feat");

      // Assert
      expect(options).toEqual([{ label: "Summer", value: "col-summer", slug: "summer" }]);
    });
  });

  describe("createOperandExclusionValueProvider", () => {
    it("should recompute count from stripped value", () => {
      // Arrange
      const currentCollection = {
        label: "Featured",
        value: "col-featured",
        slug: "featured",
      };
      const baseProvider: FilterValueProvider = {
        loading: false,
        value: [createCollectionFilterElement([currentCollection])],
        persist: () => undefined,
        isPersisted: () => true,
        getTokenByName: () => undefined,
        clear: () => undefined,
        count: 1,
      };

      // Act
      const provider = createOperandExclusionValueProvider(baseProvider, {
        collection: ["col-featured"],
      });

      // Assert
      expect(provider.count).toBe(1);

      const element = provider.value[0];

      expect(FilterElement.isFilterElement(element)).toBe(true);

      if (FilterElement.isFilterElement(element)) {
        expect(element.condition.selected.value).toEqual([]);
      }
    });
  });
});
