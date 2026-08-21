import { isAddNewValueOption, toWithCustomValues } from "./utils";

describe("isAddNewValueOption", () => {
  it("should match the create row by exact label", () => {
    // Arrange
    const addNewValueLabel = "Add new value: This is a test";

    // Act / Assert
    expect(isAddNewValueOption({ label: "Add new value: This is a test" }, addNewValueLabel)).toBe(
      true,
    );
    expect(isAddNewValueOption({ label: "This is a test" }, addNewValueLabel)).toBe(false);
  });
});

describe("toWithCustomValues", () => {
  it("should strip the create-row prefix only on an exact label match", () => {
    // Arrange
    const addNewValueLabel = "Add new value: Gold";
    const transform = toWithCustomValues(addNewValueLabel);

    // Act / Assert
    expect(transform({ label: addNewValueLabel, value: "Gold" })).toEqual({
      label: "Gold",
      value: "Gold",
    });
    expect(transform({ label: "Not Gold", value: "not-gold" })).toEqual({
      label: "Not Gold",
      value: "not-gold",
    });
  });
});
