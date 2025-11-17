import { NoopValuesHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import { MetadataFilterInputQueryVarsBuilder } from "./MetadataFilterInputQueryVarsBuilder";

describe("MetadataAdvancedFilterQueryVarsBuilder", () => {
  const builder = new MetadataFilterInputQueryVarsBuilder();

  function createElement(selectedValue: any): FilterElement {
    const type = "metadata";
    const value = new ExpressionValue(type, type, type);
    const conditionItem: ConditionItem = {
      type: "tuple",
      label: "key-value",
      value: "input-tuple",
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(type as any), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("handles metadata", () => {
      // Arrange
      const element = createElement(["key", "value"]);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other fields", () => {
      // Arrange
      const value = new ExpressionValue("status", "status", "status");
      const element = new FilterElement(value, Condition.createEmpty(), false);

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("createOptionFetcher", () => {
    it("returns NoopValuesHandler", () => {
      // Act
      const fetcher = builder.createOptionFetcher();

      // Assert
      expect(fetcher).toBeInstanceOf(NoopValuesHandler);
    });
  });

  describe("updateWhereQueryVariables", () => {
    it("creates AND array with metadata entry for first tuple", () => {
      // Arrange
      const element = createElement(["color", "red"]);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        AND: [
          {
            metadata: {
              key: "color",
              value: { eq: "red" },
            },
          },
        ],
      });
    });

    it("adds multiple metadata entries with same key as separate AND items", () => {
      // Arrange
      const first = createElement(["color", "red"]);
      const second = createElement(["color", "blue"]);

      // Act
      let query = builder.updateWhereQueryVariables({}, first);

      query = builder.updateWhereQueryVariables(query, second);

      // Assert
      expect(query).toEqual({
        AND: [
          {
            metadata: {
              key: "color",
              value: { eq: "red" },
            },
          },
          {
            metadata: {
              key: "color",
              value: { eq: "blue" },
            },
          },
        ],
      });
    });

    it("adds metadata entries with different keys as separate AND items", () => {
      // Arrange
      const first = createElement(["color", "red"]);
      const second = createElement(["size", "xl"]);

      // Act
      let query = builder.updateWhereQueryVariables({}, first);

      query = builder.updateWhereQueryVariables(query, second);

      // Assert
      expect(query).toEqual({
        AND: [
          {
            metadata: {
              key: "color",
              value: { eq: "red" },
            },
          },
          {
            metadata: {
              key: "size",
              value: { eq: "xl" },
            },
          },
        ],
      });
    });

    it("preserves existing AND array items from other builders", () => {
      // Arrange
      const existingQuery = {
        AND: [
          {
            someOtherField: "value",
          } as any, // Other builders may add different fields to the AND array
        ],
      };

      const element = createElement(["color", "black"]);

      // Act
      const result = builder.updateWhereQueryVariables(existingQuery, element);

      // Assert
      expect(result).toEqual({
        AND: [
          {
            someOtherField: "value",
          },
          {
            metadata: {
              key: "color",
              value: { eq: "black" },
            },
          },
        ],
      });
    });

    it("returns unchanged query for non-tuple input", () => {
      // Arrange
      const value = new ExpressionValue("metadata", "metadata", "metadata");
      const selected = ConditionSelected.empty();
      const condition = new Condition(
        ConditionOptions.fromName("metadata" as any),
        selected,
        false,
      );
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });

    it("returns unchanged query for empty tuple []", () => {
      // Arrange
      const type = "metadata";
      const value = new ExpressionValue(type, type, type);
      const conditionItem: ConditionItem = {
        type: "tuple",
        label: "key-value",
        value: "input-tuple",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, []);
      const condition = new Condition(ConditionOptions.fromName(type as any), selected, false);
      const element = new FilterElement(value, condition, false);

      const query = { AND: [] as Array<any> } as const;

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toBe(query);
    });

    it("returns unchanged query for single-element tuple [key]", () => {
      // Arrange
      const type = "metadata";
      const value = new ExpressionValue(type, type, type);
      const conditionItem: ConditionItem = {
        type: "tuple",
        label: "key-value",
        value: "input-tuple",
      };
      const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, ["only-key"]);
      const condition = new Condition(ConditionOptions.fromName(type as any), selected, false);
      const element = new FilterElement(value, condition, false);

      const query = {} as const;

      // Act
      const result = builder.updateWhereQueryVariables(query, element);

      // Assert
      expect(result).toBe(query);
    });

    it("does not mutate original query or existing AND array (immutability)", () => {
      // Arrange
      const existingAnd = [{ someOtherField: "value" }] as Array<any>;
      const originalQuery: any = { AND: existingAnd };

      const element = createElement(["color", "red"]);

      // Act
      const result = builder.updateWhereQueryVariables(originalQuery, element);

      // Assert - New object and new AND array instance
      expect(result).not.toBe(originalQuery);
      expect(result.AND).not.toBe(existingAnd);
      // Original query remains unchanged
      expect(originalQuery).toEqual({ AND: [{ someOtherField: "value" }] });
      // New AND contains old item + new metadata item
      expect(result).toEqual({
        AND: [{ someOtherField: "value" }, { metadata: { key: "color", value: { eq: "red" } } }],
      });
    });

    it("includes key with empty value when both key and value are provided but value is empty", () => {
      // Arrange
      const element = createElement(["mykey", ""]);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        AND: [
          {
            metadata: {
              key: "mykey",
            },
          },
        ],
      });
    });
  });
});
