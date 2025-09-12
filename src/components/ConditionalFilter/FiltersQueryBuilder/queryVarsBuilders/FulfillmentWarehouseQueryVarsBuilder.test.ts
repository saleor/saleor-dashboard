import { ApolloClient } from "@apollo/client";

import { WarehouseHandler } from "../../API/Handler";
import { Condition } from "../../FilterElement/Condition";
import { ConditionItem, ConditionOptions } from "../../FilterElement/ConditionOptions";
import { ConditionSelected } from "../../FilterElement/ConditionSelected";
import { ConditionValue } from "../../FilterElement/ConditionValue";
import { ExpressionValue, FilterElement } from "../../FilterElement/FilterElement";
import {
  FulfillmentWarehouseFilterQueryPart,
  FulfillmentWarehouseQueryVarsBuilder,
} from "./FulfillmentWarehouseQueryVarsBuilder";

describe("FulfillmentWarehouseQueryVarsBuilder", () => {
  const builder = new FulfillmentWarehouseQueryVarsBuilder();
  const client = {} as ApolloClient<unknown>;

  function createElement(
    selectedValue: ConditionValue,
    conditionLabel: string = "is",
  ): FilterElement {
    const type = "fulfillmentWarehouse";
    const value = new ExpressionValue(type, type, type);
    const conditionType = Array.isArray(selectedValue) ? "multiselect" : "combobox";
    const conditionItem: ConditionItem = {
      type: conditionType,
      label: conditionLabel,
      value: `input-${conditionType}`,
    };
    const selected = ConditionSelected.fromConditionItemAndValue(conditionItem, selectedValue);
    const condition = new Condition(ConditionOptions.fromName(type), selected, false);

    return new FilterElement(value, condition, false);
  }

  describe("canHandle", () => {
    it("handles fulfillmentWarehouse", () => {
      // Arrange
      const element = createElement("warehouse-1");

      // Act
      const result = builder.canHandle(element);

      // Assert
      expect(result).toBe(true);
    });

    it("does not handle other types", () => {
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
    it("returns WarehouseHandler", () => {
      // Arrange
      const inputValue = "warehouse";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue);

      // Assert
      expect(fetcher).toBeInstanceOf(WarehouseHandler);
    });

    it("passes client and inputValue to WarehouseHandler", () => {
      // Arrange
      const inputValue = "test-warehouse";

      // Act
      const fetcher = builder.createOptionFetcher(client, inputValue) as WarehouseHandler;

      // Assert
      expect(fetcher.client).toBe(client);
      expect(fetcher.query).toBe(inputValue);
    });
  });

  describe("updateWhereQueryVariables", () => {
    it("adds a single warehouse with it's id to fulfillments array", () => {
      // Arrange
      const warehouseOption = {
        label: "Main Warehouse",
        value: "V1JIMTIzCg==",
        slug: "main-warehouse",
      };
      const element = createElement(warehouseOption, "is");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        fulfillments: [{ warehouse: { id: { eq: "V1JIMTIzCg==" } } }],
      });
    });

    it("adds multiple selected warehouses as one `oneOf` element to fulfillments array", () => {
      // Arrange
      const warehouseOptions = [
        { label: "Warehouse 1", value: "WRH1", slug: "warehouse-1" },
        { label: "Warehouse 2", value: "WRH2", slug: "warehouse-2" },
        { label: "Warehouse 3", value: "WRH3", slug: "warehouse-3" },
      ];
      const element = createElement(warehouseOptions, "in");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        fulfillments: [{ warehouse: { id: { oneOf: ["WRH1", "WRH2", "WRH3"] } } }],
      });
    });

    it("adds single selected warehouse to existing fulfillments array", () => {
      // Arrange
      const existingQuery: FulfillmentWarehouseFilterQueryPart = {
        fulfillments: [{ warehouse: { id: { eq: "OLD123" } } }],
      };
      const element = createElement("WRH123", "is");

      // Act
      const result = builder.updateWhereQueryVariables(existingQuery, element);

      // Assert
      expect(result).toEqual({
        fulfillments: [
          { warehouse: { id: { eq: "OLD123" } } },
          { warehouse: { id: { eq: "WRH123" } } },
        ],
      });
    });

    it("skips update when there is no selected condition value", () => {
      // Arrange
      const value = new ExpressionValue(
        "fulfillmentWarehouse",
        "fulfillmentWarehouse",
        "fulfillmentWarehouse",
      );
      const selected = ConditionSelected.empty();
      const condition = new Condition(
        ConditionOptions.fromName("fulfillmentWarehouse"),
        selected,
        false,
      );
      const element = new FilterElement(value, condition, false);

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });

    it("doesn't add value to array which is an empty string", () => {
      // Arrange
      const element = createElement("", "is");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });

    it("doesn't add warehouse which is null", () => {
      // Arrange
      const element = createElement(null as any, "is");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({});
    });

    it("handles empty array of warehouses", () => {
      // Arrange
      const element = createElement([], "in");

      // Act
      const result = builder.updateWhereQueryVariables({}, element);

      // Assert
      expect(result).toEqual({
        fulfillments: [{ warehouse: { id: { oneOf: [] } } }],
      });
    });

    it("preserves other existing filter fields", () => {
      // Arrange
      const existingQuery = {
        status: { oneOf: ["PENDING", "CONFIRMED"] },
        createdAt: { gte: "2023-01-01T00:00:00.000Z" },
        fulfillments: [{ status: { eq: "FULFILLED" } }],
      };
      const element = createElement("WRH123", "is");

      // Act
      const result = builder.updateWhereQueryVariables(existingQuery as any, element);

      // Assert
      expect(result).toEqual({
        status: { oneOf: ["PENDING", "CONFIRMED"] },
        createdAt: { gte: "2023-01-01T00:00:00.000Z" },
        fulfillments: [{ status: { eq: "FULFILLED" } }, { warehouse: { id: { eq: "WRH123" } } }],
      });
    });
  });
});
