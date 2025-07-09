import { Condition, FilterElement } from "../FilterElement";
import { ExpressionValue } from "../FilterElement/FilterElement";
import { FilterQueryVarsBuilderResolver } from "./FilterQueryVarsBuilderResolver";
import { AttributeQueryVarsBuilder } from "./queryVarsBuilders";
import { DefaultQueryVarsBuilder } from "./queryVarsBuilders/DefaultQueryVarsBuilder";
import { StaticBooleanQueryVarsBuilder } from "./queryVarsBuilders/StaticBooleanQueryVarsBuilder";
import { StaticQueryVarsBuilder } from "./queryVarsBuilders/StaticQueryVarsBuilder";

// Helper to create a mock FilterDefinition with required methods
function createMockDefinition(canHandleImpl: (element: FilterElement) => boolean) {
  return {
    canHandle: jest.fn(canHandleImpl),
    createOptionFetcher: jest.fn(),
    updateWhereQueryVariables: jest.fn(),
    updateFilterQueryVariables: jest.fn(),
  };
}

describe("FilterDefinitionResolver", () => {
  describe("getDefaultDefinitions", () => {
    it("should have DefaultDefinition as the last item", () => {
      // Arrange & Act
      const defs = FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders();

      // Assert
      expect(defs[defs.length - 1]).toBeInstanceOf(DefaultQueryVarsBuilder);
    });
  });

  describe("getDefaultResolver", () => {
    it("should create resolver with default definitions", () => {
      // Arrange & Act
      const resolver = FilterQueryVarsBuilderResolver.getDefaultResolver();

      // Assert
      expect(resolver).toBeInstanceOf(FilterQueryVarsBuilderResolver);

      const defs = resolver["queryVarsBuilders"];

      expect(defs).toEqual(FilterQueryVarsBuilderResolver.getDefaultQueryVarsBuilders());
    });
  });

  describe("resolve", () => {
    it("should resolve AttributeQueryVarsBuilder for attribute elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("attribute", "Attribute", "attribute"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterQueryVarsBuilderResolver([
        new AttributeQueryVarsBuilder(),
        new DefaultQueryVarsBuilder(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(AttributeQueryVarsBuilder);
    });

    it("should resolve StaticDefinition for supported static elements", () => {
      // Arrange
      const element = FilterElement.createStaticBySlug("category");
      const resolver = new FilterQueryVarsBuilderResolver([
        new StaticQueryVarsBuilder(),
        new DefaultQueryVarsBuilder(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(StaticQueryVarsBuilder);
    });

    it("should resolve StaticBooleanDefinition for boolean static elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("isPublished", "Is Published", "isPublished"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterQueryVarsBuilderResolver([
        new StaticBooleanQueryVarsBuilder(),
        new DefaultQueryVarsBuilder(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(StaticBooleanQueryVarsBuilder);
    });

    it("should resolve DefaultDefinition when no specific definition matches", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("unknown", "Unknown", "unknown"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterQueryVarsBuilderResolver([new DefaultQueryVarsBuilder()]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(DefaultQueryVarsBuilder);
    });

    it("should respect definition order (first match wins)", () => {
      // Arrange
      const element = FilterElement.createStaticBySlug("category");
      const defA = createMockDefinition(() => true);
      const defB = createMockDefinition(() => true);
      const resolver = new FilterQueryVarsBuilderResolver([defA, defB]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBe(defA);
      expect(defA.canHandle).toHaveBeenCalledWith(element);
      expect(defB.canHandle).not.toHaveBeenCalled();
    });

    it("should resolve to first definition that can handle the element", () => {
      // Arrange
      const element = FilterElement.createStaticBySlug("category");
      const defA = createMockDefinition(() => false);
      const defB = createMockDefinition(() => true);
      const resolver = new FilterQueryVarsBuilderResolver([defA, defB]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBe(defB);
      expect(defA.canHandle).toHaveBeenCalledWith(element);
      expect(defB.canHandle).toHaveBeenCalledWith(element);
    });

    it("should throw error if no definition can handle element and no DefaultDefinition", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("unknown", "Unknown", "unknown"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterQueryVarsBuilderResolver([]);

      // Act & Assert
      expect(() => resolver.resolve(element)).toThrow(
        'No definition found for filter element: "unknown"',
      );
    });
  });
});
