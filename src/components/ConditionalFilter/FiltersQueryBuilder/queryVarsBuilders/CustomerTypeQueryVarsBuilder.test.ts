import { CustomerTypeHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { type ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { type ItemOption } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { CustomerTypeQueryVarsBuilder } from "./CustomerTypeQueryVarsBuilder";

const mockClient = {} as any;

describe("CustomerTypeQueryVarsBuilder", () => {
  const def = new CustomerTypeQueryVarsBuilder();

  const createElement = (selectedValue: ItemOption | ItemOption[] | string) => {
    const value = new ExpressionValue("customerType", "Customer type", "customerType");
    const options = ConditionOptions.fromName("customerType");
    const conditionItem: ConditionItem = { type: "combobox", label: "is", value: "input-1" };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(options, selected, false);

    return new FilterElement(value, condition, false);
  };

  describe("canHandle", () => {
    it("should return true for customerType elements", () => {
      // Arrange
      const element = createElement("b2b");

      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for other elements", () => {
      // Arrange
      const value = new ExpressionValue("dateJoined", "Join date", "dateJoined");
      const condition = Condition.createEmpty();
      const element = new FilterElement(value, condition, false);

      // Act
      const result = def.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("should create a CustomerTypeHandler", () => {
      // Act
      const handler = def.createOptionFetcher(mockClient, "");

      // Assert
      expect(handler).toBeInstanceOf(CustomerTypeHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    it("should create an eq query part for a single ItemOption", () => {
      // Arrange
      const itemOption: ItemOption = {
        label: "B2B",
        value: "Q3VzdG9tZXJUeXBlOjE=",
        slug: "b2b",
      };
      const element = createElement(itemOption);

      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.customerType).toEqual({ eq: "Q3VzdG9tZXJUeXBlOjE=" });
    });

    it("should create a oneOf query part for multiple ItemOptions", () => {
      // Arrange
      const itemOptions: ItemOption[] = [
        { label: "B2B", value: "id-1", slug: "b2b" },
        { label: "Retail", value: "id-2", slug: "retail" },
      ];
      const element = createElement(itemOptions);

      // Act
      const result = def.updateWhereQueryVariables({}, element);

      // Assert
      expect(result.customerType).toEqual({ oneOf: ["id-1", "id-2"] });
    });
  });

  describe("updateFilterQueryVariables", () => {
    it("should leave the filter query unchanged", () => {
      // Act
      const result = def.updateFilterQueryVariables({ dateJoined: { gte: "2025-01-01" } } as any);

      // Assert
      expect(result).toEqual({ dateJoined: { gte: "2025-01-01" } });
    });
  });
});
