import { LanguageCodeEnum, type LanguageFragment } from "@dashboard/graphql";

import { resolveTranslationSourceLanguage } from "./resolveTranslationSourceLanguage";

const makeLanguage = (code: LanguageCodeEnum, language: string): LanguageFragment => ({
  __typename: "LanguageDisplay",
  code,
  language,
});

describe("resolveTranslationSourceLanguage", () => {
  it("always uses original label even when English is configured", () => {
    // Arrange
    const languages = [
      makeLanguage(LanguageCodeEnum.EN, "English"),
      makeLanguage(LanguageCodeEnum.PL, "Polish"),
    ];

    // Act
    const result = resolveTranslationSourceLanguage(languages, LanguageCodeEnum.PL);

    // Assert
    expect(result).toEqual({
      language: null,
      useOriginalLabel: true,
    });
  });

  it("uses original label for single-market shops without English", () => {
    // Arrange
    const languages = [
      makeLanguage(LanguageCodeEnum.FR, "French"),
      makeLanguage(LanguageCodeEnum.PL, "Polish"),
    ];

    // Act
    const result = resolveTranslationSourceLanguage(languages, LanguageCodeEnum.PL);

    // Assert
    expect(result).toEqual({
      language: null,
      useOriginalLabel: true,
    });
  });
});
