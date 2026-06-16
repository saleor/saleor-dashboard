import { attributes } from "@dashboard/attributes/fixtures";
import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { AttributeInputTypeEnum, AttributeTypeEnum } from "@dashboard/graphql";
import { GridCellKind } from "@glideapps/glide-data-grid";
import { createIntl } from "react-intl";

import { attributesListStaticColumnsAdapter, createGetCellContent } from "./datagrid";

const intl = createIntl({ locale: "en", messages: {} });

describe("AttributeListDatagrid attributesListStaticColumnsAdapter", () => {
  it("includes attribute type column after input type", () => {
    // Arrange
    const columns = attributesListStaticColumnsAdapter(intl, {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });

    // Act
    const columnIds = columns.map(column => column.id);
    const inputTypeIndex = columnIds.indexOf("input-type");
    const attributeTypeIndex = columnIds.indexOf("attribute-type");

    // Assert
    expect(attributeTypeIndex).toBeGreaterThan(inputTypeIndex);
    expect(attributeTypeIndex).toBe(inputTypeIndex + 1);
  });
});

describe("AttributeListDatagrid createGetCellContent", () => {
  it("renders input type cell with icon and localized label", () => {
    // Arrange
    const columns = attributesListStaticColumnsAdapter(intl, {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });
    const listAttributes = [
      {
        ...attributes[0],
        inputType: AttributeInputTypeEnum.BOOLEAN,
      },
    ];
    const getCellContent = createGetCellContent({
      attributes: listAttributes,
      columns,
      intl,
    });
    const inputTypeColumnIndex = columns.findIndex(column => column.id === "input-type");

    // Act
    const cell = getCellContent([inputTypeColumnIndex, 0]);

    // Assert
    expect(cell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "attribute-input-type-cell",
        inputType: AttributeInputTypeEnum.BOOLEAN,
        label: "Boolean",
      },
    });
  });

  it("renders placeholder when input type is missing", () => {
    // Arrange
    const columns = attributesListStaticColumnsAdapter(intl, {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });
    const listAttributes = [
      {
        ...attributes[0],
        inputType: null,
      },
    ];
    const getCellContent = createGetCellContent({
      attributes: listAttributes,
      columns,
      intl,
    });
    const inputTypeColumnIndex = columns.findIndex(column => column.id === "input-type");

    // Act
    const cell = getCellContent([inputTypeColumnIndex, 0]);

    // Assert
    expect(cell).toMatchObject({
      kind: GridCellKind.Text,
      data: PLACEHOLDER,
    });
  });

  it("renders product attribute type cell with icon and localized label", () => {
    // Arrange
    const columns = attributesListStaticColumnsAdapter(intl, {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });
    const listAttributes = [
      {
        ...attributes[0],
        type: AttributeTypeEnum.PRODUCT_TYPE,
      },
    ];
    const getCellContent = createGetCellContent({
      attributes: listAttributes,
      columns,
      intl,
    });
    const attributeTypeColumnIndex = columns.findIndex(column => column.id === "attribute-type");

    // Act
    const cell = getCellContent([attributeTypeColumnIndex, 0]);

    // Assert
    expect(cell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "attribute-type-cell",
        attributeType: AttributeTypeEnum.PRODUCT_TYPE,
        label: "Product Attribute",
      },
    });
  });

  it("renders model attribute type cell with icon and localized label", () => {
    // Arrange
    const columns = attributesListStaticColumnsAdapter(intl, {
      sort: AttributeListUrlSortField.name,
      asc: true,
    });
    const listAttributes = [
      {
        ...attributes[0],
        type: AttributeTypeEnum.PAGE_TYPE,
      },
    ];
    const getCellContent = createGetCellContent({
      attributes: listAttributes,
      columns,
      intl,
    });
    const attributeTypeColumnIndex = columns.findIndex(column => column.id === "attribute-type");

    // Act
    const cell = getCellContent([attributeTypeColumnIndex, 0]);

    // Assert
    expect(cell).toMatchObject({
      kind: GridCellKind.Custom,
      data: {
        kind: "attribute-type-cell",
        attributeType: AttributeTypeEnum.PAGE_TYPE,
        label: "Model Attribute",
      },
    });
  });
});
