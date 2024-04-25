// @ts-strict-ignore
import { OrderListQuery } from "@dashboard/graphql";
import { OrderListUrlSortField } from "@dashboard/orders/urls";
import { RelayToFlat } from "@dashboard/types";

import { canBeSorted, getColumnNameAndId, getOrdersRowsLength } from "./utils";

describe("OrderListDatagrid utils", () => {
  describe("getOrdersRowsLength", () => {
    it("should return 1 when loading", () => {
      // Arrange & Act
      const rowLength = getOrdersRowsLength([], true);

      // Asset
      expect(rowLength).toBe(1);
    });
    it("should return orders length", () => {
      // Arrange & Act
      const rowLength = getOrdersRowsLength(
        [
          {} as RelayToFlat<OrderListQuery["orders"]>[number],
          {} as RelayToFlat<OrderListQuery["orders"]>[number],
        ],
        false,
      );

      // Asset
      expect(rowLength).toBe(2);
    });
    it("should return 0 when no orders and no loading", () => {
      // Arrange & Act
      const rowLength = getOrdersRowsLength([], false);

      // Asset
      expect(rowLength).toBe(0);
    });
  });
  describe("getColumnNameAndId", () => {
    it("should return column name with id when column name included colon", () => {
      // Arrange & Act
      const rowLength = getColumnNameAndId("attributes:123");

      // Asset
      expect(rowLength).toEqual({
        columnName: "attributes",
        columnId: "123",
      });
    });
    it("should return column name whem column name without colon", () => {
      // Arrange & Act
      const rowLength = getColumnNameAndId("test123");

      // Asset
      expect(rowLength).toEqual({
        columnName: "test123",
      });
    });
  });
  describe("canBeSorted", () => {
    it.each([
      OrderListUrlSortField.number,
      OrderListUrlSortField.date,
      OrderListUrlSortField.customer,
      OrderListUrlSortField.payment,
      OrderListUrlSortField.fulfillment,
    ])(`should return true when sortable field %s`, sortField => {
      expect(canBeSorted(sortField)).toBe(true);
    });
    it("should return false when not sortable field", () => {
      expect(canBeSorted(OrderListUrlSortField.total)).toBe(false);
      expect(canBeSorted(OrderListUrlSortField.rank)).toBe(false);
    });
  });
});
