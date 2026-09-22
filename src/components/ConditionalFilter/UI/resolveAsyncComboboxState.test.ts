import {
  includeSelectedComboboxOptions,
  isSelectedComboboxLabel,
  isSelectedMultiselectLabel,
  resolveComboboxValue,
} from "./resolveAsyncComboboxState";

const selected = {
  label: "Retail",
  value: "retail",
  slug: "retail",
};

const apiOption = {
  label: "Retail",
  value: "Q3VzdG9tZXJUeXBlOjE=",
  slug: "retail",
};

const otherOption = {
  label: "VIP",
  value: "Q3VzdG9tZXJUeXBlOjI=",
  slug: "vip",
};

describe("includeSelectedComboboxOptions", () => {
  it("returns options unchanged when nothing is selected", () => {
    // Arrange
    const options = [otherOption];

    // Act
    const result = includeSelectedComboboxOptions(options, null);

    // Assert
    expect(result).toEqual(options);
  });

  it("keeps fetched options when the selected slug is already present", () => {
    // Arrange
    const options = [apiOption, otherOption];

    // Act
    const result = includeSelectedComboboxOptions(options, selected);

    // Assert
    expect(result).toEqual(options);
  });

  it("prepends selected values that are missing from the fetched page", () => {
    // Arrange
    const options = [otherOption];

    // Act
    const result = includeSelectedComboboxOptions(options, [selected]);

    // Assert
    expect(result).toEqual([selected, otherOption]);
  });
});

describe("resolveComboboxValue", () => {
  it("returns null when nothing is selected", () => {
    // Arrange & Act
    const result = resolveComboboxValue([apiOption], null);

    // Assert
    expect(result).toBeNull();
  });

  it("uses the fetched option so the combobox value matches the list identity", () => {
    // Arrange & Act
    const result = resolveComboboxValue([apiOption, otherOption], selected);

    // Assert
    expect(result).toEqual(apiOption);
  });
});

describe("isSelectedComboboxLabel", () => {
  it("ignores the selected label so opening does not search for the current value", () => {
    // Arrange & Act & Assert
    expect(isSelectedComboboxLabel(selected, "Retail")).toBe(true);
  });

  it("lets a real search through", () => {
    // Arrange & Act & Assert
    expect(isSelectedComboboxLabel(selected, "vip")).toBe(false);
    expect(isSelectedComboboxLabel(selected, "")).toBe(false);
  });
});

describe("isSelectedMultiselectLabel", () => {
  it("ignores a chip label so selecting does not search for the picked value", () => {
    // Arrange & Act & Assert
    expect(isSelectedMultiselectLabel([selected, otherOption], "Retail")).toBe(true);
  });

  it("lets a real search through", () => {
    // Arrange & Act & Assert
    expect(isSelectedMultiselectLabel([selected], "vip")).toBe(false);
    expect(isSelectedMultiselectLabel([selected], "")).toBe(false);
  });
});
