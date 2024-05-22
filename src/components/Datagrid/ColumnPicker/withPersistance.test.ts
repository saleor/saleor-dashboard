import { PersistedColumn } from "../persistance/persistedColumn";
import {
  dynamicWithPersistance,
  selectedWithPersistance,
  visibleWithPersistance,
} from "./withPersistance";

describe("ColumnPicker / withPersistance", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    // Arrange
    [
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
      [new PersistedColumn("name", 300)],
      [
        { id: "name", title: "Name", width: 300 },
        { id: "email", title: "Email", width: 150 },
      ],
    ],
    [
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
      [],
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
    ],
    [
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
      [],
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
    ],
  ])(
    `applies persistance values to the visible columns (set index: %#)`,
    (visible, persisted, expected) => {
      // Act
      const resultedColumns = visibleWithPersistance(visible, persisted);

      // Assert
      expect(resultedColumns).toEqual(expected);
    },
  );

  it.each([
    // Arrange
    [
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
      [new PersistedColumn("name", 300)],
      [{ id: "name", title: "Name", width: 150 }],
    ],
    [
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
      [],
      [
        { id: "name", title: "Name", width: 150 },
        { id: "email", title: "Email", width: 150 },
      ],
    ],
    [null, [], null],
  ])(
    "filters out dynamically loaded column by its persisted equivalents (set index: %#)",
    (dynamic, persisted, expected) => {
      // Act
      const resultedColumns = dynamicWithPersistance(dynamic, persisted);

      // Assert
      expect(resultedColumns).toEqual(expected);
    },
  );

  it.each([
    // Arrange
    [["name", "email"], [new PersistedColumn("name", 300)], ["name"]],
    [["name", "email"], [], ["name", "email"]],
    [[], [], []],
  ])("gets persisted column identifiers (set index: %#)", (selected, persisted, expected) => {
    // Act
    const resultedColumns = selectedWithPersistance(selected, persisted);

    // Assert
    expect(resultedColumns).toEqual(expected);
  });
});
