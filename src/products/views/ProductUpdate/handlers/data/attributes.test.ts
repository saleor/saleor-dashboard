import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { type DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { AttributeInputTypeEnum, type VariantAttributeFragment } from "@dashboard/graphql";
import { variantAttributes } from "@dashboard/products/fixtures";

import { getAttributeData } from "./attributes";

const numericAttributeId = "numeric-attribute-id";
const numericVariantAttributes: VariantAttributeFragment[] = [
  ...variantAttributes,
  {
    ...variantAttributes[0],
    id: numericAttributeId,
    name: "Weight",
    slug: "weight",
    inputType: AttributeInputTypeEnum.NUMERIC,
  },
];

describe("getAttributeData", () => {
  test("should filter and map data to attribute format", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      {
        column: "attribute:QXR0cmlidXRlOjE1",
        row: 1,
        data: { value: { value: "test" } },
      },
      {
        column: "attribute:QXR0cmlidXRlOjY4MQ==",
        row: 1,
        data: { value: { value: "test2" } },
      },
    ];
    // Act
    const attributes = getAttributeData(changeData, 1, variantAttributes);

    // Assert
    expect(attributes).toEqual([
      {
        id: "QXR0cmlidXRlOjE1",
        dropdown: {
          value: "test",
        },
      },
      { id: "QXR0cmlidXRlOjY4MQ==", plainText: "test2" },
    ]);
  });
  test("should return empty array when no changes for given row", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: "attribute:1", row: 1, data: { value: { value: "test" } } },
      { column: "attribute:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const attributes = getAttributeData(changeData, 2, variantAttributes);

    // Assert
    expect(attributes).toEqual([]);
  });
  test("should return empty array when no changes for attributes column", () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: "channel:1", row: 1, data: { value: { value: "test" } } },
      { column: "channel:2", row: 1, data: { value: { value: "test2" } } },
    ];
    // Act
    const attributes = getAttributeData(changeData, 1, variantAttributes);

    // Assert
    expect(attributes).toEqual([]);
  });
  test("should return numeric input for numeric attribute change", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      {
        column: `attribute:${numericAttributeId}`,
        row: 1,
        data: {
          kind: "number-cell",
          value: 150,
        },
      },
    ];

    // Act
    const attributes = getAttributeData(changeData, 1, numericVariantAttributes);

    // Assert
    expect(attributes).toEqual([
      {
        id: numericAttributeId,
        numeric: "150",
      },
    ]);
  });
  test("should return null numeric input when numeric attribute is cleared", () => {
    // Arrange
    const changeData: DatagridChange[] = [
      {
        column: `attribute:${numericAttributeId}`,
        row: 1,
        data: {
          kind: "number-cell",
          value: numberCellEmptyValue,
        },
      },
    ];

    // Act
    const attributes = getAttributeData(changeData, 1, numericVariantAttributes);

    // Assert
    expect(attributes).toEqual([
      {
        id: numericAttributeId,
        numeric: null,
      },
    ]);
  });
});
