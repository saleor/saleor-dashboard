import { Condition, FilterElement } from "../FilterElement";
import { ExpressionValue } from "../FilterElement/FilterElement";
import { AttributeDefinition } from "./definitions/AttributeDefinition";
import { CollectionPublishedDefinition } from "./definitions/CollectionPublishedDefinition";
import { DefaultDefinition } from "./definitions/DefaultDefinition";
import { MetadataDefinition } from "./definitions/MetadataDefinition";
import { StaticBooleanDefinition } from "./definitions/StaticBooleanDefinition";
import { StaticDefinition } from "./definitions/StaticDefinition";
import { VoucherStatusDefinition } from "./definitions/VoucherStatusDefinition";
import { FilterDefinitionResolver } from "./FilterDefinitionResolver";

// Helper to create a mock FilterDefinition with required methods
function createMockDefinition(canHandleImpl: (element: FilterElement) => boolean) {
  return {
    canHandle: jest.fn(canHandleImpl),
    createOptionFetcher: jest.fn(),
    updateWhereQuery: jest.fn(),
    updateFilterQuery: jest.fn(),
  };
}

describe("FilterDefinitionResolver", () => {
  describe("getDefaultDefinitions", () => {
    it("should have DefaultDefinition as the last item", () => {
      // Arrange & Act
      const defs = FilterDefinitionResolver.getDefaultDefinitions();

      // Assert
      expect(defs[defs.length - 1]).toBeInstanceOf(DefaultDefinition);
    });
  });

  describe("getDefaultResolver", () => {
    it("should create resolver with default definitions", () => {
      // Arrange & Act
      const resolver = FilterDefinitionResolver.getDefaultResolver();

      // Assert
      expect(resolver).toBeInstanceOf(FilterDefinitionResolver);

      const defs = resolver["definitions"];

      expect(defs).toEqual(FilterDefinitionResolver.getDefaultDefinitions());
    });
  });

  describe("resolve", () => {
    it("should resolve AttributeDefinition for attribute elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("attribute", "Attribute", "attribute"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([
        new AttributeDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(AttributeDefinition);
    });

    it("should resolve StaticDefinition for supported static elements", () => {
      // Arrange
      const element = FilterElement.createStaticBySlug("category");
      const resolver = new FilterDefinitionResolver([
        new StaticDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(StaticDefinition);
    });

    it("should resolve StaticBooleanDefinition for boolean static elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("isPublished", "Is Published", "isPublished"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([
        new StaticBooleanDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(StaticBooleanDefinition);
    });

    it("should resolve MetadataDefinition for metadata elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("metadata", "Metadata", "metadata"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([
        new MetadataDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(MetadataDefinition);
    });

    it("should resolve CollectionPublishedDefinition for collection published elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("published", "Published", "published"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([
        new CollectionPublishedDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(CollectionPublishedDefinition);
    });

    it("should resolve VoucherStatusDefinition for voucher status elements", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("voucherStatus", "Voucher Status", "voucherStatus"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([
        new VoucherStatusDefinition(),
        new DefaultDefinition(),
      ]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(VoucherStatusDefinition);
    });

    it("should resolve DefaultDefinition when no specific definition matches", () => {
      // Arrange
      const element = new FilterElement(
        new ExpressionValue("unknown", "Unknown", "unknown"),
        Condition.createEmpty(),
        false,
      );
      const resolver = new FilterDefinitionResolver([new DefaultDefinition()]);
      // Act
      const def = resolver.resolve(element);

      // Assert
      expect(def).toBeInstanceOf(DefaultDefinition);
    });

    it("should respect definition order (first match wins)", () => {
      // Arrange
      const element = FilterElement.createStaticBySlug("category");
      const defA = createMockDefinition(() => true);
      const defB = createMockDefinition(() => true);
      const resolver = new FilterDefinitionResolver([defA, defB]);
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
      const resolver = new FilterDefinitionResolver([defA, defB]);
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
      const resolver = new FilterDefinitionResolver([]);

      // Act & Assert
      expect(() => resolver.resolve(element)).toThrow(
        'No definition found for filter element: "unknown"',
      );
    });
  });
});
