import {
  FALLBACK_ICON_COLOR,
  FALLBACK_ICON_NAME,
  MODEL_TYPE_ICON_COLOR_KEY,
  MODEL_TYPE_ICON_NAME_KEY,
} from "./constants";
import {
  buildModelTypeIconMetadataUpdate,
  getModelTypeIcon,
  isSameModelTypeIcon,
  readModelTypeIcon,
} from "./getModelTypeIcon";

const entry = (key: string, value: string) => ({ key, value });

describe("readModelTypeIcon", () => {
  it("reads a configured icon", () => {
    // Arrange
    const metadata = [
      entry(MODEL_TYPE_ICON_NAME_KEY, "book-open"),
      entry(MODEL_TYPE_ICON_COLOR_KEY, "blue"),
    ];

    // Act
    const icon = readModelTypeIcon(metadata);

    // Assert
    expect(icon).toEqual({ name: "book-open", color: "blue" });
  });

  it("falls back to the neutral colour when the stored colour is unknown", () => {
    // Arrange
    const metadata = [
      entry(MODEL_TYPE_ICON_NAME_KEY, "book-open"),
      entry(MODEL_TYPE_ICON_COLOR_KEY, "chartreuse"),
    ];

    // Act
    const icon = readModelTypeIcon(metadata);

    // Assert
    expect(icon).toEqual({ name: "book-open", color: FALLBACK_ICON_COLOR });
  });

  it("treats a colour without a name as unset", () => {
    // Arrange
    const metadata = [entry(MODEL_TYPE_ICON_COLOR_KEY, "blue")];

    // Act & Assert
    expect(readModelTypeIcon(metadata)).toBeNull();
  });

  it.each([[undefined], [null], [[]], [[entry(MODEL_TYPE_ICON_NAME_KEY, "   ")]]])(
    "returns null for %p",
    metadata => {
      // Act & Assert
      expect(readModelTypeIcon(metadata)).toBeNull();
    },
  );
});

describe("getModelTypeIcon", () => {
  it("returns the fallback icon for an unconfigured model type", () => {
    // Act & Assert
    expect(getModelTypeIcon([])).toEqual({
      name: FALLBACK_ICON_NAME,
      color: FALLBACK_ICON_COLOR,
    });
  });
});

describe("buildModelTypeIconMetadataUpdate", () => {
  it("writes both keys when an icon is set", () => {
    // Act
    const update = buildModelTypeIconMetadataUpdate({ name: "book-open", color: "red" });

    // Assert
    expect(update).toEqual({
      input: [
        { key: MODEL_TYPE_ICON_NAME_KEY, value: "book-open" },
        { key: MODEL_TYPE_ICON_COLOR_KEY, value: "red" },
      ],
      keysToDelete: [],
    });
  });

  it("deletes both keys when the icon is cleared", () => {
    // Act
    const update = buildModelTypeIconMetadataUpdate(null);

    // Assert
    expect(update).toEqual({
      input: [],
      keysToDelete: [MODEL_TYPE_ICON_NAME_KEY, MODEL_TYPE_ICON_COLOR_KEY],
    });
  });
});

describe("isSameModelTypeIcon", () => {
  it.each([
    [null, null, true],
    [{ name: "book-open", color: "red" as const }, null, false],
    [
      { name: "book-open", color: "red" as const },
      { name: "book-open", color: "red" as const },
      true,
    ],
    [
      { name: "book-open", color: "red" as const },
      { name: "book-open", color: "blue" as const },
      false,
    ],
  ])("compares %p with %p", (a, b, expected) => {
    // Act & Assert
    expect(isSameModelTypeIcon(a, b)).toBe(expected);
  });
});
