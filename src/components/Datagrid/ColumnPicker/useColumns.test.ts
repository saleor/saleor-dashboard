import { act, renderHook } from "@testing-library/react-hooks";

import { AvailableColumn } from "../types";
import { ColumnCategory, useColumns } from "./useColumns";

const mockedColumns: AvailableColumn[] = [
  {
    id: "name",
    title: "Name",
    width: 200,
    metaGroup: "Product",
    hasMenu: false,
    icon: "arrowUp",
  },
  {
    id: "description",
    title: "Description",
    width: 100,
    metaGroup: "Sales Information",
    hasMenu: false,
    icon: "arrowUp",
  },
];

const mockedSelectedColumns = ["name", "attribute:QXR0cmlidXRlOjE0"];

const mockedCategories: ColumnCategory[] = [
  {
    name: "Attributes",
    prefix: "attribute",
    availableNodes: [
      {
        id: "attribute:QXR0cmlidXRlOjIx",
        title: "ABV",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjI3",
        title: "Author",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE1",
        title: "Bottle Size",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE4",
        title: "Bucket Size",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
        metaGroup: "Attributes",
        width: 200,
      },
    ],
    selectedNodes: [
      {
        id: "attribute:QXR0cmlidXRlOjIx",
        title: "ABV",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE1",
        title: "Bottle Size",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjUwOQ==",
        title: "storage size ",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjI5",
        title: "Tag",
        metaGroup: "Attributes",
        width: 200,
      },
    ],
    hasNextPage: false,
    hasPreviousPage: false,
    onNextPage: () => undefined,
    onPreviousPage: () => undefined,
    onSearch: () => undefined,
  },
];

const mockedColumnPickerSettings = [
  "attribute:QXR0cmlidXRlOjIx",
  "attribute:QXR0cmlidXRlOjE1",
  "attribute:QXR0cmlidXRlOjUwOQ==",
  "attribute:QXR0cmlidXRlOjI5",
  "attribute:QXR0cmlidXRlOjE0",
];

const expectedVisibleColumns = [
  {
    id: "name",
    title: "Name",
    width: 200,
    metaGroup: "Product",
    hasMenu: false,
    icon: "arrowUp",
  },
  {
    id: "attribute:QXR0cmlidXRlOjE0",
    title: "Color",
    metaGroup: "Attributes",
    width: 200,
  },
];

// In order of mockedColumnPickerSettings
const expectedDynamicColumns = [
  {
    id: "attribute:QXR0cmlidXRlOjIx",
    title: "ABV",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjE1",
    title: "Bottle Size",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjUwOQ==",
    title: "storage size ",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjI5",
    title: "Tag",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjE0",
    title: "Color",
    metaGroup: "Attributes",
    width: 200,
  },
];

const setDynamicColumnSettings = jest.fn();
const onSave = jest.fn();

describe("useColumns", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return initial state", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );
    // Assert
    expect(result.current.visibleColumns).toEqual(expectedVisibleColumns);
    expect(result.current.staticColumns).toEqual(mockedColumns);
    expect(result.current.dynamicColumns).toEqual(expectedDynamicColumns);
    expect(result.current.selectedColumns).toEqual(mockedSelectedColumns);
    expect(result.current.columnCategories).toEqual(mockedCategories);
    expect(result.current.columnPickerSettings).toEqual(
      mockedColumnPickerSettings,
    );
  });
  it("should update visible column info when resized", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() =>
      result.current.handlers.onResize({ id: "name", title: "Name" }, 150),
    );

    // Assert
    expect(result.current.visibleColumns[0].width).toEqual(150);
  });
  it("should rearrange columns when moved", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() => result.current.handlers.onMove(1, 0));

    // Assert
    expect(result.current.visibleColumns).toEqual(
      expectedVisibleColumns.reverse(),
    );
  });
  it("should call onSave when column is changed", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() => result.current.handlers.onChange(["name"]));

    // Assert
    expect(onSave).toHaveBeenCalledTimes(1);
  });
  it("should set recentlyAddedColumn when column is added", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() =>
      result.current.handlers.onChange([
        "name",
        "attribute:QXR0cmlidXRlOjE0",
        "attribute:QXR0cmlidXRlOjIx",
      ]),
    );

    // Assert
    expect(result.current.recentlyAddedColumn).toEqual(
      "attribute:QXR0cmlidXRlOjIx",
    );
  });
  it("should update dynamic columns when new column is picked", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() =>
      result.current.handlers.onDynamicColumnSelect([
        ...mockedColumnPickerSettings,
        "attribute:QXR0cmlidXRlOjI3",
      ]),
    );

    // Assert
    expect(setDynamicColumnSettings).toHaveBeenCalledTimes(1);
    expect(result.current.dynamicColumns).toEqual([
      ...expectedDynamicColumns,
      {
        id: "attribute:QXR0cmlidXRlOjI3",
        title: "Author",
        metaGroup: "Attributes",
        width: 200,
      },
    ]);
  });
  it("should update dynamic columns when column is removed", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
        columnPickerSettings: mockedColumnPickerSettings,
        setDynamicColumnSettings,
      }),
    );

    // Act
    act(() =>
      result.current.handlers.onDynamicColumnSelect([
        "attribute:QXR0cmlidXRlOjIx",
        "attribute:QXR0cmlidXRlOjE1",
        "attribute:QXR0cmlidXRlOjI5",
        "attribute:QXR0cmlidXRlOjE0",
      ]),
    );

    // Assert
    expect(setDynamicColumnSettings).toHaveBeenCalledTimes(1);
    expect(result.current.dynamicColumns).toEqual([
      {
        id: "attribute:QXR0cmlidXRlOjIx",
        title: "ABV",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE1",
        title: "Bottle Size",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjI5",
        title: "Tag",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
        metaGroup: "Attributes",
        width: 200,
      },
    ]);
  });
});
