import { createIntl } from "react-intl";

import {
  createGeneralNameDescriptionSection,
  createPageGeneralSection,
  createProductMediaAltSection,
  createSeoTranslationSection,
  createSingleNameSection,
} from "./translationSectionBuilders";
import { TranslationFieldType, TranslationInputFieldName } from "./types";

const intl = createIntl({ locale: "en", messages: {} });

describe("createProductMediaAltSection", () => {
  it("maps original and translated alt text to one short translation field", () => {
    // Arrange // Act
    const section = createProductMediaAltSection(intl, {
      alt: "Front product view",
      translationAlt: "Produktansicht von vorne",
    });

    // Assert
    expect(section.fields[0].nullable).toBeFalsy();
    expect(section.fields).toEqual([
      expect.objectContaining({
        displayName: "Alt text",
        name: TranslationInputFieldName.alt,
        ripple: expect.objectContaining({
          ID: "product-media-alt-translation",
        }),
        translation: "Produktansicht von vorne",
        type: TranslationFieldType.SHORT,
        value: "Front product view",
      }),
    ]);
  });
});

describe("createSingleNameSection", () => {
  it("marks the name as nullable when requested", () => {
    // Arrange // Act
    const section = createSingleNameSection(
      intl,
      { name: "Summer sale", translationName: "Letnia wyprzedaż" },
      { nameLabel: "Sale Name", nullableName: true },
    );

    // Assert
    expect(section.fields).toEqual([
      expect.objectContaining({
        name: TranslationInputFieldName.name,
        nullable: true,
      }),
    ]);
  });

  it("leaves the name non-nullable by default", () => {
    // Arrange // Act
    const section = createSingleNameSection(
      intl,
      { name: "Size M", translationName: "Rozmiar M" },
      { nameLabel: "Variant Name" },
    );

    // Assert
    expect(section.fields[0].nullable).toBeFalsy();
  });
});

describe("createSeoTranslationSection", () => {
  it("marks every SEO field as nullable", () => {
    // Arrange // Act
    const section = createSeoTranslationSection(intl, {});

    // Assert
    expect(section.fields.map(field => field.nullable)).toEqual([true, true, true]);
  });
});

describe("createGeneralNameDescriptionSection", () => {
  it("marks the name and description as nullable", () => {
    // Arrange // Act
    const section = createGeneralNameDescriptionSection(intl, {});

    // Assert
    expect(section.fields.map(field => field.nullable)).toEqual([true, true]);
  });
});

describe("createPageGeneralSection", () => {
  it("marks the title and content as nullable", () => {
    // Arrange // Act
    const section = createPageGeneralSection(intl, {});

    // Assert
    expect(section.fields.map(field => field.nullable)).toEqual([true, true]);
  });
});
