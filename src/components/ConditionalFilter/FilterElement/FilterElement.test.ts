import { FilterElement } from "./FilterElement";

describe("ConditionalFilter / FilterElement / FilterElement", () => {
  it("creates empty filter element", () => {
    // Arrange
    const element = FilterElement.createEmpty();

    // Act & Assert
    expect(element.isEmpty()).toBeTruthy();
  });
  it("creates for slug", () => {
    // Arrange
    const element = FilterElement.createStaticBySlug("category");

    // Act & Assert
    expect(element).toEqual({
      condition: {
        loading: false,
        options: [
          {
            label: "is",
            type: "combobox",
            value: "input-1",
          },
          {
            label: "in",
            type: "multiselect",
            value: "input-2",
          },
        ],
        selected: {
          conditionValue: {
            label: "is",
            type: "combobox",
            value: "input-1",
          },
          loading: false,
          options: [],
          value: "",
        },
      },
      constraint: undefined,
      loading: false,
      value: {
        label: "Category",
        type: "category",
        value: "category",
      },
    });
  });
});
