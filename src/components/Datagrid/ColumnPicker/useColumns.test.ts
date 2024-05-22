import { act, renderHook } from "@testing-library/react-hooks";

import { AvailableColumn } from "../types";
import { ColumnCategory, useColumns } from "./useColumns";

const mockedColumns: AvailableColumn[] = [
  {
    id: "name",
    title: "Name",
    width: 200,
    icon: "arrowUp",
  },
  {
    id: "description",
    title: "Description",
    width: 100,
    icon: "arrowUp",
  },
];
// dynamic - color and ABV
const mockedSelectedColumns = ["name", "attribute:QXR0cmlidXRlOjE0", "attribute:QXR0cmlidXRlOjIx"];
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
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
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
const expectedVisibleColumns = [
  {
    id: "name",
    title: "Name",
    width: 200,
    icon: "arrowUp",
  },
  {
    id: "attribute:QXR0cmlidXRlOjE0",
    title: "Color",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjIx",
    title: "ABV",
    metaGroup: "Attributes",
    width: 200,
  },
];
const expectedDynamicColumns = [
  {
    id: "attribute:QXR0cmlidXRlOjE0",
    title: "Color",
    metaGroup: "Attributes",
    width: 200,
  },
  {
    id: "attribute:QXR0cmlidXRlOjIx",
    title: "ABV",
    metaGroup: "Attributes",
    width: 200,
  },
];
const onSave = jest.fn();

jest.mock("../persistance/usePersistance", () => ({
  usePersistance: () => ({
    columns: [],
    update: jest.fn(),
  }),
}));

jest.mock("./withPersistance", () => ({
  visibleWithPersistance: (x: AvailableColumn[]) => x,
  dynamicWithPersistance: (x: AvailableColumn[]) => x,
  selectedWithPersistance: (x: AvailableColumn[]) => x,
}));

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
      }),
    );

    // Assert
    expect(result.current.visibleColumns).toEqual(expectedVisibleColumns);
    expect(result.current.staticColumns).toEqual(mockedColumns);
    expect(result.current.dynamicColumns).toEqual(expectedDynamicColumns);
    expect(result.current.selectedColumns).toEqual(mockedSelectedColumns);
    expect(result.current.columnCategories).toEqual(mockedCategories);
  });
  it("should update visible column info when resized", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
      }),
    );

    // Act
    act(() => result.current.handlers.onResize({ id: "name", title: "Name" }, 150));
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
      }),
    );

    // Act
    act(() => result.current.handlers.onMove(1, 0));
    // Assert
    expect(result.current.visibleColumns).toEqual([
      {
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
        metaGroup: "Attributes",
        width: 200,
      },
      {
        id: "name",
        title: "Name",
        width: 200,
        icon: "arrowUp",
      },
      {
        id: "attribute:QXR0cmlidXRlOjIx",
        title: "ABV",
        metaGroup: "Attributes",
        width: 200,
      },
    ]);
  });
  it("should call onSave when column is toggled", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
      }),
    );

    // Act
    act(() => result.current.handlers.onToggle("name"));
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
      }),
    );

    // Act
    act(() => result.current.handlers.onToggle("attribute:QXR0cmlidXRlOjI3"));
    // Assert
    expect(result.current.recentlyAddedColumn).toEqual("attribute:QXR0cmlidXRlOjI3");
  });
  it("should update dynamic columns when new column is picked", () => {
    // Arrange
    const { result } = renderHook(() =>
      useColumns({
        staticColumns: mockedColumns,
        selectedColumns: mockedSelectedColumns,
        columnCategories: mockedCategories,
        onSave,
      }),
    );

    // Act
    act(() => result.current.handlers.onToggle("attribute:QXR0cmlidXRlOjI3"));
    // Assert
    expect(onSave).toHaveBeenCalledTimes(1);
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
      }),
    );

    // Act
    act(() =>
      result.current.handlers.onToggle(
        // ABV - which is already selected
        "attribute:QXR0cmlidXRlOjIx",
      ),
    );
    // Assert
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(result.current.dynamicColumns).toEqual([
      {
        id: "attribute:QXR0cmlidXRlOjE0",
        title: "Color",
        metaGroup: "Attributes",
        width: 200,
      },
    ]);
  });
});
