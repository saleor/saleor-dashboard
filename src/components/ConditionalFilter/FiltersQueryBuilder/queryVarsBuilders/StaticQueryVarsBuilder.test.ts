import {
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  CustomerHandler,
  PageTypesHandler,
  ProductsHandler,
  ProductTypeHandler,
} from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { StaticQueryVarsBuilder } from "./StaticQueryVarsBuilder";

const mockClient = {} as any;

describe("StaticQueryVarsBuilder", () => {
  describe("canHandle", () => {
    it.each([
      "collection",
      "category",
      "productType",
      "channel",
      "products",
      "pageTypes",
      "customer",
    ])("should return true for static elements with supported field name: %s", field => {
      // Arrange
      const value = new ExpressionValue(field, field, field);
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      const def = new StaticQueryVarsBuilder();
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for unsupported static elements", () => {
      // Arrange
      const def = new StaticQueryVarsBuilder();
      const value = new ExpressionValue("unsupported", "Unsupported", "unsupported");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false for non-static elements", () => {
      // Arrange
      const def = new StaticQueryVarsBuilder();
      const value = new ExpressionValue("collection", "Collection", "notstatic");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should create the correct handler for each supported field type", () => {
      // Arrange
      const def = new StaticQueryVarsBuilder();
      const supportedFields = [
        ["collection", CollectionHandler],
        ["category", CategoryHandler],
        ["productType", ProductTypeHandler],
        ["channel", ChannelHandler],
        ["products", ProductsHandler],
        ["pageTypes", PageTypesHandler],
        ["customer", CustomerHandler],
      ] as const;

      for (const [field, HandlerClass] of supportedFields) {
        const value = new ExpressionValue(field, field, field);
        const condition = Condition.createEmpty();
        const element = new FilterElement(value, condition, false);
        // Act
        const handler = def.createOptionFetcher(mockClient, "", element);

        // Assert
        expect(handler).toBeInstanceOf(HandlerClass);
      }
    });
    it("should throw an error for unsupported static element types", () => {
      // Arrange
      const def = new StaticQueryVarsBuilder();
      const value = new ExpressionValue("unsupported", "Unsupported", "unsupported");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act & Assert
      expect(() => def.createOptionFetcher(mockClient, "", element)).toThrow(
        "Unknown static element: unsupported",
      );
    });
  });

  describe("updateWhereQueryVariables", () => {
    const def = new StaticQueryVarsBuilder();
    const value = new ExpressionValue("collection", "Collection", "collection");
    const options = ConditionOptions.fromName("collection");
    const conditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-4" };

    it("should create an 'eq' query part for a single value (string)", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.collection).toEqual({ eq: "foo" });
    });
    it("should create an 'eq' query part for a single value (ItemOption)", () => {
      // Arrange
      const itemOption: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, itemOption);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.collection).toEqual({ eq: "foo" });
    });
    it("should create an 'oneOf' query part for multiple values (ItemOption array)", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
      const itemOption2: ItemOption = { label: "Bar", value: "bar", slug: "bar" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.collection).toEqual({ oneOf: ["foo", "bar"] });
    });
    it("should handle different value types gracefully (string array)", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
      const itemOption2: ItemOption = { label: "Bar", value: "bar", slug: "bar" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.collection).toEqual({ oneOf: ["foo", "bar"] });
    });
  });

  describe("updateFilterQueryVariables", () => {
    const def = new StaticQueryVarsBuilder();
    const value = new ExpressionValue("collection", "Collection", "collection");
    const options = ConditionOptions.fromName("collection");
    const conditionItem: ConditionItem = { type: "multiselect", label: "in", value: "input-4" };

    it("should map a single value correctly for the legacy FILTER API", () => {
      // Arrange
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, "foo");
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.collection).toBe("foo");
    });
    it("should map multiple values correctly for the legacy FILTER API", () => {
      // Arrange
      const itemOption1: ItemOption = { label: "Foo", value: "foo", slug: "foo" };
      const itemOption2: ItemOption = { label: "Bar", value: "bar", slug: "bar" };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, [
        itemOption1,
        itemOption2,
      ]);
      const condition = new Condition(options, selected, false);
      const element = new FilterElement(value, condition, false);
      // Act
      const result = def.updateFilterQueryVariables({}, element);

      // Assert
      expect(result.collection).toEqual(["foo", "bar"]);
    });
  });
});
