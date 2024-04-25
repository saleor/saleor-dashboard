// @ts-strict-ignore
import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { ProductFragment } from "@dashboard/graphql";

import { getStockData, getVaraintUpdateStockData } from "./stock";

describe("getStockData", () => {
  test("should filter and map to stock format", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      {
        data: false,
        column: "availableInChannel:Q2hhbm5lbDox",
        row: 1,
      },
      { column: "attribute:2", row: 2, data: { value: { value: "test2" } } },
      { column: "warehouse:Q2hhbm5lbDox", row: 1, data: { value: "12345" } },
      { column: "warehouse:Q2hhbm5lbDot", row: 1, data: { value: "5666" } },
    ];
    // Act
    const stocks = getStockData(changeData, 1);

    // Assert
    expect(stocks).toEqual([
      {
        warehouse: "Q2hhbm5lbDox",
        quantity: "12345",
      },
      {
        warehouse: "Q2hhbm5lbDot",
        quantity: "5666",
      },
    ]);
  });
  test("should return empty array when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const stocks = getStockData(changeData, 1);

    // Assert
    expect(stocks).toEqual([]);
  });
  test("should return empty string when no name column for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [{ column: "name", row: 2, data: "Joe" }];
    // Act
    const stocks = getStockData(changeData, 1);

    // Assert
    expect(stocks).toEqual([]);
  });
});
describe("getVaraintUpdateStockData", () => {
  const stocks = [
    {
      id: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
      warehouse: {
        id: "Q2hhbm5lbDox",
      },
    },
    {
      id: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
      warehouse: {
        id: "Q2hhbm5lbDot",
      },
    },
  ];

  test("should handle update stocks", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "warehouse:Q2hhbm5lbDox", row: 1, data: { value: "12345" } },
      { column: "warehouse:Q2hhbm5lbDot", row: 1, data: { value: "5666" } },
    ];
    // Act
    const variantStocks = getVaraintUpdateStockData(changeData, 1, {
      stocks,
    } as ProductFragment["variants"][number]);

    // Assert
    expect(variantStocks).toEqual({
      create: [],
      remove: [],
      update: [
        {
          stock: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
          quantity: "12345",
        },
        {
          stock: "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
          quantity: "5666",
        },
      ],
    });
  });
  test("should handle remove stocks", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      {
        column: "warehouse:Q2hhbm5lbDox",
        row: 1,
        data: { value: numberCellEmptyValue },
      },
      {
        column: "warehouse:Q2hhbm5lbDot",
        row: 1,
        data: { value: numberCellEmptyValue },
      },
    ];
    // Act
    const variantStocks = getVaraintUpdateStockData(changeData, 1, {
      stocks,
    } as ProductFragment["variants"][number]);

    // Assert
    expect(variantStocks).toEqual({
      create: [],
      remove: [
        "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjA=",
        "UHJvZHVjdFZhcmlhbnRDaGFubmVsTGlzdGluZzoyNjD=",
      ],
      update: [],
    });
  });
  test("should handle create stocks", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "warehouse:Q2hhbm5lbDof", row: 1, data: { value: "12345" } },
      { column: "warehouse:Q2hhbm5lbDod", row: 1, data: { value: "5666" } },
    ];
    // Act
    const variantStocks = getVaraintUpdateStockData(changeData, 1, {
      stocks,
    } as ProductFragment["variants"][number]);

    // Assert
    expect(variantStocks).toEqual({
      create: [
        {
          warehouse: "Q2hhbm5lbDof",
          quantity: "12345",
        },
        {
          warehouse: "Q2hhbm5lbDod",
          quantity: "5666",
        },
      ],
      remove: [],
      update: [],
    });
  });
  test("should return empty array when no changes for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const variantStocks = getVaraintUpdateStockData(changeData, 1, {
      stocks,
    } as ProductFragment["variants"][number]);

    // Assert
    expect(variantStocks).toEqual({ create: [], remove: [], update: [] });
  });
  test("should return empty string when no name column for given row", () => {
    // Arrange
    const changeData: DatagridChange[] = [{ column: "name", row: 2, data: "Joe" }];
    // Act
    const variantStocks = getVaraintUpdateStockData(changeData, 1, {
      stocks,
    } as ProductFragment["variants"][number]);

    // Assert
    expect(variantStocks).toEqual({ create: [], remove: [], update: [] });
  });
});
