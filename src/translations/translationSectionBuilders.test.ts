import { createIntl } from "react-intl";

import { createProductMediaAltSection } from "./translationSectionBuilders";
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
