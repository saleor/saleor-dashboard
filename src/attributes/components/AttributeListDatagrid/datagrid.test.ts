import { attributes } from "@dashboard/attributes/fixtures";
import { AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { GridCellKind } from "@glideapps/glide-data-grid";
import { createIntl } from "react-intl";

import { attributesListStaticColumnsAdapter, createGetCellContent } from "./datagrid";

const intl = createIntl({ locale: "en", messages: {} });

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
});
