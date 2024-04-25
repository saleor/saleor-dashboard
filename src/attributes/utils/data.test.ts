import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { AttributePageFormData } from "../components/AttributePage";
import { getAttributeData } from "./data";

describe("attributes utils", () => {
  it("returns swatch attributes data with its values", () => {
    // Arrange
    const attribute = {
      inputType: AttributeInputTypeEnum.SWATCH,
      storefrontSearchPosition: "10",
    } as AttributePageFormData;
    const values = [{ name: "11", value: "v11" }];
    // Act
    const attributeData = getAttributeData(attribute, values);

    // Assert
    expect(attributeData).toEqual({
      inputType: "SWATCH",
      storefrontSearchPosition: 10,
      metadata: undefined,
      privateMetadata: undefined,
      values: [
        {
          name: "11",
          value: "v11",
        },
      ],
    });
  });
  // Arrange
  it.each([
    {
      attribute: {
        inputType: AttributeInputTypeEnum.DROPDOWN,
        storefrontSearchPosition: "10",
      } as AttributePageFormData,
      values: [{ name: "dropdown1", value: "dropdown1-val" }],
      expected: {
        inputType: "DROPDOWN",
        storefrontSearchPosition: 10,
        metadata: undefined,
        privateMetadata: undefined,
        values: [{ name: "dropdown1" }],
      },
    },
    {
      attribute: {
        inputType: AttributeInputTypeEnum.MULTISELECT,
        storefrontSearchPosition: "10",
      } as AttributePageFormData,
      values: [{ name: "multiselect1", value: "multiselect1-val" }],
      expected: {
        inputType: "MULTISELECT",
        storefrontSearchPosition: 10,
        metadata: undefined,
        privateMetadata: undefined,
        values: [{ name: "multiselect1" }],
      },
    },
    {
      attribute: {
        inputType: AttributeInputTypeEnum.SWATCH,
        storefrontSearchPosition: "10",
      } as AttributePageFormData,
      values: [{ name: "swatch1", value: "swatch1-val" }],
      expected: {
        inputType: "SWATCH",
        storefrontSearchPosition: 10,
        metadata: undefined,
        privateMetadata: undefined,
        values: [
          {
            name: "swatch1",
            value: "swatch1-val",
          },
        ],
      },
    },
  ])("returns attributes data with deticated values", ({ attribute, values, expected }) => {
    // Act
    const attributeData = getAttributeData(attribute, values);

    // Assert
    expect(attributeData).toEqual(expected);
  });
});
