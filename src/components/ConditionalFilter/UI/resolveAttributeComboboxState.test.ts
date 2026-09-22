import {
  resolveAttributeComboboxOptions,
  resolveAttributeComboboxValue,
} from "./resolveAttributeComboboxState";
import { type LeftOperatorOption } from "./types";

const selected: Pick<LeftOperatorOption, "label" | "value" | "type"> = {
  label: "Tier",
  value: "tier",
  type: "DROPDOWN",
};

const apiOption: LeftOperatorOption = {
  label: "Tier",
  value: "QXR0cmlidXRlOjE=",
  type: "DROPDOWN",
  slug: "tier",
};

const otherOption: LeftOperatorOption = {
  label: "Contract date",
  value: "QXR0cmlidXRlOjI=",
  type: "DATE",
  slug: "contract-date",
};

describe("resolveAttributeComboboxOptions", () => {
  it("returns options unchanged when nothing is selected", () => {
    // Arrange
    const options = [otherOption];

    // Act
    const result = resolveAttributeComboboxOptions(options, null);

    // Assert
    expect(result).toEqual(options);
  });

  it("keeps API options when the selected slug is already present", () => {
    // Arrange
    const options = [apiOption, otherOption];

    // Act
    const result = resolveAttributeComboboxOptions(options, selected);

    // Assert
    expect(result).toEqual(options);
  });

  it("prepends the selected attribute when the fetched list does not include it", () => {
    // Arrange
    const options = [otherOption];

    // Act
    const result = resolveAttributeComboboxOptions(options, selected);

    // Assert
    expect(result).toEqual([
      {
        label: "Tier",
        value: "tier",
        type: "DROPDOWN",
        slug: "tier",
      },
      otherOption,
    ]);
  });
});

describe("resolveAttributeComboboxValue", () => {
  it("returns null when nothing is selected", () => {
    // Arrange & Act
    const result = resolveAttributeComboboxValue([apiOption], null);

    // Assert
    expect(result).toBeNull();
  });

  it("uses the fetched option so the combobox value matches the list identity", () => {
    // Arrange & Act
    const result = resolveAttributeComboboxValue([apiOption, otherOption], selected);

    // Assert
    expect(result).toEqual(apiOption);
  });

  it("falls back to the selected slug when the list has not loaded yet", () => {
    // Arrange & Act
    const result = resolveAttributeComboboxValue([], selected);

    // Assert
    expect(result).toEqual({
      label: "Tier",
      value: "tier",
      type: "DROPDOWN",
      slug: "tier",
    });
  });
});
