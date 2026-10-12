import { numberCellEmptyValue } from "@dashboard/components/Datagrid/customCells/NumberCell";
import { AttributeInputTypeEnum, type ProductDetailsVariantFragment } from "@dashboard/graphql";
import { product, variant as createVariant, variantAttributes } from "@dashboard/products/fixtures";

import { getData } from "./utils";

const numericAttribute = { ...variantAttributes[0], inputType: AttributeInputTypeEnum.NUMERIC };
const baseVariant: ProductDetailsVariantFragment = {
  ...createVariant(""),
  attributes: product("").attributes,
};

describe("numeric variant grid cells", () => {
  test.each([
    { name: "0", expected: 0 },
    { name: "12.5", expected: 12.5 },
    { name: "invalid", expected: numberCellEmptyValue },
    { name: "Infinity", expected: numberCellEmptyValue },
    { name: "", expected: numberCellEmptyValue },
  ])("renders stored value $name", ({ name, expected }) => {
    // Arrange
    const variant: ProductDetailsVariantFragment = {
      ...baseVariant,
      attributes: [
        {
          ...baseVariant.attributes[0],
          attribute: { ...baseVariant.attributes[0].attribute, id: numericAttribute.id },
          values: [{ ...baseVariant.attributes[0].values[0], name }],
        },
      ],
    };

    // Act
    const cell = getData({
      availableColumns: [{ id: `attribute:${numericAttribute.id}`, title: "Number", width: 100 }],
      changes: { current: [] },
      added: [],
      removed: [],
      column: 0,
      row: 0,
      channels: [],
      variants: [variant],
      variantAttributes: [numericAttribute],
      getChangeIndex: () => -1,
      searchAttributeValues: async () => [],
    });

    // Assert
    expect(cell).toMatchObject({ data: { kind: "number-cell", value: expected } });
  });
});
