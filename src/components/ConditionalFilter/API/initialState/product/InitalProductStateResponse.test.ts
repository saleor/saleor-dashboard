import { AttributeEntityTypeEnum } from "@dashboard/graphql";

import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialProductStateResponse } from "./InitialProductStateResponse";

describe("ConditionalFilter / API / InitialProductStateResponse", () => {
  it("should filter by dynamic attribute token", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "attribute-1": {
        choices: [
          { label: "Choice 1", value: "value-1", slug: "choice-1" },
          { label: "Choice 2", value: "value-2", slug: "choice-2" },
        ],
        slug: "attribute-1",
        value: "1",
        label: "Attribute 1",
        inputType: "DROPDOWN",
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("o2.attribute-1", ["value-1"]));
    const expectedOutput = [{ label: "Choice 1", slug: "choice-1", value: "value-1" }];
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should filter by static token type", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.category = [{ label: "Category 1", value: "1", slug: "category-1" }];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.category-1", "category-1"));
    const expectedOutput = ["category-1"];
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should filter by boolean attribute token", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "attribute-2": {
        choices: [
          { label: "True", value: "true", slug: "true" },
          { label: "False", value: "false", slug: "false" },
        ],
        slug: "attribute-2",
        value: "2",
        label: "Attribute 2",
        inputType: "BOOLEAN",
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("b0.attribute-2", "true"));
    const expectedOutput = {
      label: "Yes",
      slug: "true",
      type: "BOOLEAN",
      value: "true",
    };
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
  it("should filter by static attribute token", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      size: {
        value: "",
        label: "Size",
        slug: "size",
        inputType: "NUMERIC",
        choices: [],
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("n0.size", "123"));
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual("123");
  });
  it("should filter by REFERENCE attribute token (single value)", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "ref-attr": {
        choices: [
          { label: "Page 1", value: "page-1", slug: "page-1" },
          { label: "Page 2", value: "page-2", slug: "page-2" },
        ],
        slug: "ref-attr",
        value: "1",
        label: "Reference Attribute",
        inputType: "REFERENCE",
        entityType: AttributeEntityTypeEnum.PAGE,
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("r0.ref-attr", ["page-1"]));
    const expectedOutput = [{ label: "Page 1", value: "page-1", slug: "page-1" }];
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by REFERENCE attribute token (multiple values)", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "ref-attr": {
        choices: [
          { label: "Page 1", value: "page-1", slug: "page-1" },
          { label: "Page 2", value: "page-2", slug: "page-2" },
        ],
        slug: "ref-attr",
        value: "1",
        label: "Reference Attribute",
        inputType: "REFERENCE",
        entityType: AttributeEntityTypeEnum.PAGE,
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("r0.ref-attr", ["page-1", "page-2"]));
    const expectedOutput = [
      { label: "Page 1", value: "page-1", slug: "page-1" },
      { label: "Page 2", value: "page-2", slug: "page-2" },
    ];
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should return empty array for REFERENCE attribute with unknown entityType", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "ref-attr": {
        choices: [{ label: "Unknown", value: "unknown", slug: "unknown" }],
        slug: "ref-attr",
        value: "1",
        label: "Reference Attribute",
        inputType: "REFERENCE",
        entityType: undefined as any,
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("r0.ref-attr", ["unknown"]));
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual([{ label: "Unknown", value: "unknown", slug: "unknown" }]);
  });

  it("should return empty array for REFERENCE attribute with empty choices", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "ref-attr": {
        choices: [],
        slug: "ref-attr",
        value: "1",
        label: "Reference Attribute",
        inputType: "REFERENCE",
        entityType: AttributeEntityTypeEnum.PAGE,
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("r0.ref-attr", ["page-1"]));
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual([]);
  });

  it("should skip choices with missing slug for REFERENCE attribute", () => {
    // Arrange
    const initialState = InitialProductStateResponse.empty();

    initialState.attribute = {
      "ref-attr": {
        choices: [
          { label: "Page 1", value: "page-1", slug: undefined } as any,
          { label: "Page 2", value: "page-2", slug: "page-2" },
        ],
        slug: "ref-attr",
        value: "1",
        label: "Reference Attribute",
        inputType: "REFERENCE",
        entityType: AttributeEntityTypeEnum.PAGE,
      },
    };

    const token = UrlToken.fromUrlEntry(new UrlEntry("r0.ref-attr", ["page-2"]));
    const expectedOutput = [{ label: "Page 2", value: "page-2", slug: "page-2" }];
    // Act
    const result = initialState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
