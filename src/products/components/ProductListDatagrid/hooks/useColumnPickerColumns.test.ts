// @ts-strict-ignore
import { ProductListColumns } from "@dashboard/config";
import {
  GridAttributesQuery,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import { ListSettings, RelayToFlat } from "@dashboard/types";
import { renderHook } from "@testing-library/react-hooks";

import { useColumnPickerColumns } from "./useColumnPickerColumns";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
}));

describe("useColumnPickerColumns", () => {
  const staticColumns = [
    {
      label: "Availability",
      value: "availability" as ProductListColumns,
    },
    {
      label: "Price",
      value: "price" as ProductListColumns,
    },
    {
      label: "Description",
      value: "description" as ProductListColumns,
    },
    {
      label: "Type",
      value: "productType" as ProductListColumns,
    },
    {
      label: "Last updated",
      value: "date" as ProductListColumns,
    },
  ];

  it("should return static columns when attributes are empty and settings contains all columns", () => {
    // Arrange
    const settings = {
      columns: [
        "availability",
        "description",
        "price",
        "productType",
        "date",
      ] as ListSettings<ProductListColumns>["columns"],
      rowNumber: 20,
    };

    const defaultSettings = settings.columns;

    // Act
    const { result } = renderHook(() =>
      useColumnPickerColumns([], [], settings, defaultSettings),
    );

    // Assert
    expect(result.current).toEqual({
      initialColumns: [...staticColumns],
      availableColumns: [...staticColumns],
      defaultColumns: [...defaultSettings],
    });
  });

  it("should return columns selected in settings", () => {
    // Arrange
    const settings = {
      columns: [
        "availability",
        "date",
      ] as ListSettings<ProductListColumns>["columns"],
      rowNumber: 20,
    };

    const defaultSettings = settings.columns;

    // Act
    const { result } = renderHook(() =>
      useColumnPickerColumns([], [], settings, defaultSettings),
    );

    // Assert
    expect(result.current).toEqual({
      initialColumns: [staticColumns[0], staticColumns[4]],
      availableColumns: [...staticColumns],
      defaultColumns: [...defaultSettings],
    });
  });

  it("should return selected in setting with attributes", () => {
    // Arrange
    const settings = {
      columns: [
        "availability",
        "date",
      ] as ListSettings<ProductListColumns>["columns"],
      rowNumber: 20,
    };
    const selectedAttibutes = [
      {
        __typename: "Attribute",
        id: "1",
        name: "Attr1",
      },
      {
        __typename: "Attribute",
        id: "2",
        name: "Attr2",
      },
    ] as RelayToFlat<GridAttributesQuery["grid"]>;

    const availableAttributesToSelect = [
      {
        __typename: "Attribute",
        id: "op1",
        name: "AttrOption1",
      },
      {
        __typename: "Attribute",
        id: "op2",
        name: "AttrOption2",
      },
      {
        __typename: "Attribute",
        id: "op3",
        name: "AttrOption3",
      },
    ] as RelayToFlat<SearchAvailableInGridAttributesQuery["availableInGrid"]>;

    const defaultSettings = settings.columns;

    // Act
    const { result } = renderHook(() =>
      useColumnPickerColumns(
        selectedAttibutes,
        availableAttributesToSelect,
        settings,
        defaultSettings,
      ),
    );

    // Assert
    expect(result.current).toEqual({
      initialColumns: [
        staticColumns[0],
        staticColumns[4],
        {
          label: "Attr1",
          value: "attribute:1",
        },
        { label: "Attr2", value: "attribute:2" },
      ],
      availableColumns: [
        ...staticColumns,
        {
          label: "AttrOption1",
          value: "attribute:op1",
        },
        { label: "AttrOption2", value: "attribute:op2" },
        { label: "AttrOption3", value: "attribute:op3" },
      ],
      defaultColumns: [...defaultSettings],
    });
  });
});
